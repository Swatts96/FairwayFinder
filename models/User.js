import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true }, // Renamed from "password" for clarity
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Optional
  },
  { timestamps: true }
);

// Pre-save middleware to hash the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next(); // Avoid rehashing
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});




// Method to compare password
userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password_hash);
  console.log(`Comparing: ${password} with ${this.password_hash} -> ${isMatch}`);
  return isMatch;
};



// Export the model
const User = mongoose.model('User', userSchema);
export default User;
