import { Router } from 'express';
import {
    getConsultas,
    getConsultaById,
    createConsulta,
    updateConsulta
} from '../controllers/consulta.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();
router.use(verifyToken);

router.get('/', getConsultas);
router.get('/:id', getConsultaById);
router.post('/', createConsulta);
router.put('/:id', updateConsulta);

export default router;
