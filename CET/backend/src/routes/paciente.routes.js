import { Router } from 'express';
import {
    getPacientes,
    getPacienteById,
    getPacienteByCodigo,
    createPaciente,
    updatePaciente,
    deletePaciente,
    getHistorialPaciente
} from '../controllers/paciente.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', getPacientes);
router.get('/codigo/:codigo', getPacienteByCodigo);
router.get('/:id', getPacienteById);
router.get('/:id/historial', getHistorialPaciente);
router.post('/', createPaciente);
router.put('/:id', updatePaciente);
router.delete('/:id', deletePaciente);

export default router;
