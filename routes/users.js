import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

const router = express.Router();

// Use your environment variable for JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send('Email or username already in use');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the user
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password_hash: hashedPassword,
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

    console.log(`Found user:`, user);

    // Compare the plain password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log(`Password comparison result: ${isMatch}`);
    if (!isMatch) {
      console.log('Invalid password');
      return res.status(401).send('Invalid credentials');
    }

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
