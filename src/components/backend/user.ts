import mongoose from 'mongoose';
import { ObjectId } from "mongodb";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true }
});
const User = mongoose.model('User', userSchema);
export default User;