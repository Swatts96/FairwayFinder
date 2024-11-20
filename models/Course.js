import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    holes: { type: Number },
    type: { type: String },
    par: { type: Number },
    length: { type: String },
    rating: { type: Number },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    description: { type: String },
    website: { type: String },
    pricing: {
      weekday: {
        "18_holes": { type: String },
      },
      weekend: {
        "18_holes": { type: String },
      },
    },
  }, { collection: 'Courses' }); // Explicitly set collection name
  
  const Course = mongoose.model('Course', courseSchema);
  export default Course;
  
