
// server.js or app.js file integration example
import express from 'express';
import 'dotenv/config.js'
import dotenv from 'dotenv';
import cors from 'cors';
import { connectionDb } from './src/config/connectDB.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

import requestRoutes from './src/Routes/requestRoutes.js';
import userRoutes from './src/Routes/userRoutes.js';
import workerRoutes from './src/Routes/workerRoutes.js';

connectionDb();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/requests', requestRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));