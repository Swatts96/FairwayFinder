import express from 'express';
import Course from '../models/Course.js'; // Ensure this is the correct path

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('Fetching courses...');
    const courses = await Course.find(); // Query the `courses` collection
    console.log('Courses retrieved:', courses);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Error fetching courses');
  }
});

export default router;
