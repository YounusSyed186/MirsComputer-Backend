// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router/authRoute.js';
import router1 from './router/productRoutes.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`, // ⬅️ your actual Vercel frontend URL
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(console.error);

app.use('/api/auth', router);
app.use('/api/products', router1);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));