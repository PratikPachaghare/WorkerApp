import express from 'express'
import { createRequest, updateRequestStatus } from "../controllers/request.js";

const router = express.Router();

router.post("/create",createRequest);
router.patch("/status/:id",updateRequestStatus);

export default router;