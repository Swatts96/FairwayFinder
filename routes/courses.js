import express from 'express';
import Course from '../models/Course.js'; // Make sure the Course model is properly imported

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    console.log('Courses fetched:', courses); // Debug log
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Error fetching courses');
  }
});


export default router;