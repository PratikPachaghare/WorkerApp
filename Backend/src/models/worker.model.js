import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },

  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male',
  },

  profileImage: { type: String }, // Only one, keep this

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  rating: { type: Number, default: 1 }, // avg rating
  totalRatings: { type: Number, default: 0 },
  ratingSum: { type: Number, default: 0 },
  categories: [{ type: String, required: true }],
  subcategories: [{ type: String }],
  experience: { type: Number, default: 0 },
  description: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

workerSchema.index({ location: "2dsphere" });

export const Worker = mongoose.model("Worker", workerSchema);
