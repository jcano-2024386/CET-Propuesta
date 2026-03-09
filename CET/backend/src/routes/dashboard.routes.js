import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();
router.use(verifyToken);
router.get('/', getDashboard);

export default router;
