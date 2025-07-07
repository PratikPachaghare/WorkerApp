// routes/workerRoutes.js
import express from 'express';
const router = express.Router();
import { registerWorker, loginWorker,getNearbyWorkers, getWorkerByToken, getWorkerById, SearchWorker, getSuggestions, getNearbyWorkersCategories } from '../controllers/worker.js';
import { upload } from '../middleware/multer.js';
import { verifyToken } from '../middleware/userVerify.js';

router.post('/register',upload.single("profileImage"), registerWorker);
router.post('/login', loginWorker);
router.post('/getByToken',verifyToken,getWorkerByToken);
router.post('/getByID',getWorkerById);
router.get('/nearby', getNearbyWorkers);
router.get('/nearby/categories',getNearbyWorkersCategories);
router.get('/searchWorker', SearchWorker);
router.get('/getSuggestion', getSuggestions);


export default router;