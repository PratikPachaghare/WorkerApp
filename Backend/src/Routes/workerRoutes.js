// routes/workerRoutes.js
import express from 'express';
const router = express.Router();
import { registerWorker, loginWorker, getAll, getNearbyWorkers, getWorkerByToken, getWorkerById, SearchWorker, getSuggestions } from '../controllers/worker.js';
import { upload } from '../middleware/multer.js';
import { verifyToken } from '../middleware/userVerify.js';

router.post('/register',upload.single("profileImage"), registerWorker);
router.post('/login', loginWorker);
router.post('/getBytoken',verifyToken,getWorkerByToken);
router.post('/getByID',getWorkerById);
router.get('/getAll', getAll);
router.get('/nearby', getNearbyWorkers);
router.get('/serchWorker', SearchWorker);
router.get('/getSuggestion', getSuggestions);


export default router;