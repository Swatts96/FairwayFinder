import dotenv from 'dotenv'; // Load environment variables
import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import courseRoutes from './routes/courses.js';
import userRoutes from './routes/users.js';
import cors from 'cors';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key'; // Use a default for development

const app = express();

// Load environment variables
const PORT = process.env.PORT || 3333; // Default to 3333 if not defined in .env
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({ origin: '*' })); // Debugging only; restrict in production
app.use(express.json()); // Built-in middleware for JSON parsing

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Serve static files from the "public" directory
const __filename = fileURLToPath(import.meta.url); // Get the file URL
const __dirname = path.dirname(__filename); // Derive the directory name
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/courses', courseRoutes); // Course-related routes
app.use('/api', userRoutes); // User-related routes (e.g., register/login)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
