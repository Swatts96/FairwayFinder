import dotenv from 'dotenv'; // Load environment variables from .env
import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import courseRoutes from './routes/courses.js';
import userRoutes from './routes/users.js';
import cors from 'cors';
dotenv.config(); // Initialize dotenv to load .env variables


const app = express();

// Load environment variables
const PORT = process.env.PORT || 3000; // Default to 3000 if not defined in .env
const MONGO_URI = process.env.MONGO_URI;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Serve static files from "public" directory
const __filename = fileURLToPath(import.meta.url); // Get the file URL
const __dirname = path.dirname(__filename); // Derive the directory name
app.use(express.static(path.join(__dirname, 'public')));
 

// Routes

app.use(cors()); // Enable CORS for all routes
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});