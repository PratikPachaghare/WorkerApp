// routes/userRoutes.js
import express from 'express'
const router = express.Router();
import {registerUser,loginUser, getUserById, getUserByToken} from '../controllers/user.js'
import { verifyToken } from '../middleware/userVerify.js';
import { getCurrentUser } from '../controllers/worker.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/UserByToken',verifyToken,getCurrentUser);
router.post('/UserById',getUserById);
router.post('/getBytoken',verifyToken,getUserByToken);

export default router;