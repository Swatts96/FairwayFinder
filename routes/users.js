import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assuming your User schema is already defined
const router = express.Router();

// Secret key for JWT
const JWT_SECRET = 'your_secret_key'; // Store this securely in a .env file

// User registration
router.post('/register', async (req, res) => {
  console.log('Register endpoint hit with data:', req.body);
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Check if the email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send('Email or username already in use');
    }

    console.log('Password:', password);
    console.log('Password Hash:', user.password_hash);

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password_hash: hashedPassword,
    });

    // Save the user in the database
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

      // Debugging logs
      console.log('Login request received:', { email, password });

      const user = await User.findOne({ email });
      if (!user) return res.status(404).send('User not found');

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
          console.log('Invalid password');
          return res.status(401).send('Invalid credentials');
      }

      const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      console.log('Login successful for user:', user.email);

      res.json({ token, email: user.email, username: user.username });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).send('Server error');
  }
});



export default router;
