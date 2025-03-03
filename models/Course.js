import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  holes: { type: Number, required: true },
  type: { type: String },
  par: { type: Number },
  length: { type: String },
  slope: { type: Number },
  rating: { type: Number },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  description: { type: String },
  website: { type: String },
  pricing: {
    weekday: {
      '18_holes': { type: String },
      '9_holes': { type: String },
    },
    weekend: {
      '18_holes': { type: String },
      '9_holes': { type: String },
    }, 
  }, 
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
