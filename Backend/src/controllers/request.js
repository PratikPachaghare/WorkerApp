import {Request} from "../models/requst.model.js";

export const createRequest = async (req, res) => {
  try {
    const { user, worker, message, requestedTime, location } = req.body;

    const newRequest = new Request({
      user,
      worker,
      message,
      requestedTime,
      location
    });

    await newRequest.save();

    res.status(201).json({
        newRequest,
        message: 'Request sent to worker' });
  } catch (err) {
    res.status(500).json({ message:"error in call request ",err});
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
