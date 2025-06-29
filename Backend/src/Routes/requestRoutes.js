import express from 'express'
import { createRequest, getRequastDataByWorkerId, updateRequestStatus } from "../controllers/request.js";
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.post("/create",upload.single("ProblamImage"),createRequest);
router.patch("/status/:id",updateRequestStatus);
router.get("getRequastDataByWorkerId",getRequastDataByWorkerId);

export default router;