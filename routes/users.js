import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

const router = express.Router();

// Use your environment variable for JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already in use');
    }

    // Save the user directly; the schema middleware will hash the password
    const user = new User({
      firstName,
      lastName,
      email,
      password_hash: password, // Pass plain password here
    });

    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});




// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login request received: { email: '${email}', password: '${password}' }`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }

    console.log('Found user:', user);

    // Compare the plain password with the hashed password
    console.log('Plain password:', password);
console.log('Stored hash:', user.password_hash);

const isMatch = await bcrypt.compare(password, user.password_hash);
console.log(`Password comparison result: ${isMatch}`);


    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, email: user.email, username: user.username });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server error');
  }
});



// Test Hash (for debugging purposes)
router.post('/test-hash', async (req, res) => {
  try {
    const { plainPassword } = req.body;
    const hashed = await bcrypt.hash(plainPassword, 10);
    const isMatch = await bcrypt.compare(plainPassword, hashed);
    res.json({ hashed, isMatch });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
