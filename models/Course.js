import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  difficulty: { type: String, required: true },
  holes: { type: Number, required: true },
  par: { type: Number, required: true },
  reviews: [{ type: String }],
});

export default mongoose.model('Course', courseSchema);
