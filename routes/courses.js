import express from 'express';
const router = express.Router();
import Course from '../models/Course.js';

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).send('Error fetching courses');
  }
});

export default router;
