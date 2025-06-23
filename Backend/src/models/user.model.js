import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  phone: { type: String, required: true, unique: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  createdAt: { type: Date, default: Date.now },
});

userSchema.index({ location: "2dsphere" });

export const User = mongoose.model("User", userSchema);

