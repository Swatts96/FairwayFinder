import mongoose from 'mongoose';
import Course from './models/Course.js';

mongoose.connect('mongodb://localhost:27018/app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const courses = await Course.find();
  mongoose.connection.close();
}).catch(err => console.error(err));
