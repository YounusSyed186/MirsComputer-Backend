import express from 'express';
import { forgotPassword, login, register } from '../controllers/authControllers.js';
import fetchUserInfo from '../controllers/fetchInfo.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/info',fetchUserInfo)

export default router;