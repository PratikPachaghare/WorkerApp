import {Request} from "../models/requst.model.js";
import { uploadOnCloudinery } from "../utils/cloudnary.js";
import fs from "fs";

export const createRequest = async (req, res) => {
  try {
    const { user, worker, message,requestedDate,requestedTime, longtitude , latitude,userAddress,} = req.body;

      console.log(req.file.path);

    // Image upload logic
    let imageUrl = "";
    if (req.file) {
      const localPath = req.file.path;
      console.log(localPath);
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

// GET /api/requests/worker
export const getRequastDataByWorkerId = async (req, res) => {
  try {
    const workerId = req.userId;

    const requests = await Request.find({ worker: workerId })
      .populate("user", "-password") // get user details
      .sort({ createdAt: -1 });
    res.status(200).json({ requests });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch worker requests", error: err });
  }
};
