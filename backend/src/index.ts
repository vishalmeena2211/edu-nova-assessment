import express from 'express';
import { connectDBs } from './config/db';
import router from './routes/route';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json());

app.use('/api/v1', router);

// Connect to MongoDB
connectDBs();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});