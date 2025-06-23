import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  message: { type: String },
  requestedTime: { type: Date, required: true }, // When user wants the service
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'completed'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
});

requestSchema.index({ location: "2dsphere" });

export const Request= mongoose.model('Request', requestSchema);

