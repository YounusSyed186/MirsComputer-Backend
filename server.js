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
const allowedOrigins = [
  'https://mirscomputers.vercel.app',
  'https://mirscomputers-*-younus-syeds-projects.vercel.app/', // Add your preview deployment
  'http://localhost:3000', // Optional for local dev
];
app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      origin === 'https://mirscomputers.vercel.app' || // Production
      origin.endsWith('.vercel.app')                  // Previews
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(console.error);

app.use('/api/auth', router);
app.use('/api/products', router1);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));