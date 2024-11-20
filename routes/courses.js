import express from 'express';
import Course from '../models/Course.js'; // Make sure the Course model is properly imported

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const courses = await Course.find().skip(skip).limit(limit);
      res.json(courses);
    } catch (error) {
      res.status(500).send('Error fetching courses');
    }
  });

export default router;
