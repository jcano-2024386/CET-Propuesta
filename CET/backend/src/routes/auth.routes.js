import { Router } from 'express';
import { login, register, getProfile, changePassword } from '../controllers/auth.controller.js';
import { verifyToken, verifyRole } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', verifyToken, verifyRole('ADMIN'), register);
router.get('/profile', verifyToken, getProfile);
router.put('/change-password', verifyToken, changePassword);

export default router;
