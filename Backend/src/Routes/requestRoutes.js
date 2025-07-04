import express from 'express'
import { acceptRequast, createRequest, getRequastDataByUserId, getRequastDataByWorkerId, rejectRequast, updateRequestStatus } from "../controllers/request.js";
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.post("/create",upload.single("ProblamImage"),createRequest);
router.patch("/status/:id",updateRequestStatus);
router.post("/getRequastDataByWorkerId",getRequastDataByWorkerId);
router.post("/getRequastDataByUserId",getRequastDataByUserId);
router.patch('/accept/:id', acceptRequast );
router.patch('/reject/:id', rejectRequast);


export default router;