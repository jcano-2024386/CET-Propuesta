import { Router } from 'express';
import {
    getMedicamentos,
    getMedicamentoById,
    createMedicamento,
    updateMedicamento,
    deleteMedicamento,
    ajustarStock,
    getAlertas
} from '../controllers/medicamento.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', getMedicamentos);
router.get('/alertas', getAlertas);
router.get('/:id', getMedicamentoById);
router.post('/', createMedicamento);
router.put('/:id', updateMedicamento);
router.patch('/:id/stock', ajustarStock);
router.delete('/:id', deleteMedicamento);

export default router;
