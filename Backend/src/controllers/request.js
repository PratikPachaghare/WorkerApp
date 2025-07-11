import {Request} from "../models/requst.model.js";
import { uploadOnCloudinery } from "../utils/cloudnary.js";
import fs from "fs";
import mongoose from "mongoose";

export const createRequest = async (req, res) => {
  try {
    const { user, worker, message,requestedDate,requestedTime, longtitude , latitude,userAddress,} = req.body;
    // Image upload logic
    let imageUrl = "";
    if (req.file) {
      const localPath = req.file.path;
      const result = await uploadOnCloudinery(localPath);
      fs.unlinkSync(localPath); // Remove local file
      imageUrl = result?.secure_url || "";
      console.log("image upload and return succefully");
    }

    const newRequest = new Request({
      user,
      worker,
      message,
      requestedTime,
      requestedDate,
      location:{
        type:"Point",
        coordinates:[longtitude,latitude]
      },
      address:userAddress,
      image:imageUrl
    });

    await newRequest.save();

    res.status(201).json({
        newRequest,
        message: 'Request sent to worker' });
  } catch (err) {
    console.log("error in send requast :",err);
    res.status(500).json({ message:"error in call request :",err});
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    await request.save();

    res.status(200).json({
        request,
        message: 'Request status updated', request });
  } catch (err) {
    res.status(500).json({ message:"error in update requst ",err});
  }
};

// GET /api/requests/user
export const getRequestsByUser = async (req, res) => {
  try {
    const userId = req.userId; // from verifyToken middleware

    const requests = await Request.find({ user: userId })
      .populate("worker", "-password") // get worker details
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user requests", error: err });
  }
};

export const getRequastDataByWorkerId = async (req, res) => {
  try {
    const { workerId } = req.body;

    if (!workerId) {
      return res.status(400).json({ message: "workerId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
      return res.status(400).json({ message: "Invalid workerId" });
    }

    const objectWorkerId = new mongoose.Types.ObjectId(workerId);

    // Fetch all requests for this worker
    const requests = await Request.find({ worker: objectWorkerId })
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    // Separate requests by status
    const pendingRequests = requests.filter(req => req.status === "pending");
    const acceptedRequests = requests.filter(req => req.status === "accepted");

    res.status(200).json({
      pending: pendingRequests,
      accepted: acceptedRequests,
    });
  } catch (err) {
    console.error("error in get request data:", err);
    res.status(500).json({
      message: "Failed to fetch worker requests",
      error: err.message,
    });
  }
};

export const getRequastDataByUserId = async (req, res) => {
  try {
    const { workerId } = req.body;
    const userId = workerId;
    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid UserId" });
    }
    const objectUserId = new mongoose.Types.ObjectId(userId);
    // Fetch all requests for this worker
    const requests = await Request.find({ user: objectUserId })
      .populate("worker user", "-password")
      .sort({ createdAt: -1 });

    // Separate requests by status
    const pendingRequests = requests.filter(req => req.status === "pending");
    const acceptedRequests = requests.filter(req => req.status === "accepted");

    res.status(200).json({
      pending: pendingRequests,
      accepted: acceptedRequests,
    });
  } catch (err) {
    console.error("error in get request data:", err);
    res.status(500).json({
      message: "Failed to fetch worker requests",
      error: err.message,
    });
  }
};

export const acceptRequast = async (req, res) => {
  const { id } = req.params;
  await Request.findByIdAndUpdate(id, { status: 'accepted' });
  res.send({ message: 'Request accepted' });
}

export const rejectRequast = async (req, res) => {
  const { id } = req.params;
  await Request.findByIdAndUpdate(id, { status: 'rejected' });
  res.send({ message: 'Request rejected' });
}
