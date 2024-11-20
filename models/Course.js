import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  difficulty: { type: String },
  holes: { type: Number },
  par: { type: Number },
  description: { type: String },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
