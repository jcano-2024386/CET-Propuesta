'use strict';

import Paciente from '../models/paciente.model.js';
import Medicamento from '../models/medicamento.model.js';
import Consulta from '../models/consulta.model.js';

export const getDashboard = async (req, res, next) => {
    try {
        const hoy = new Date();
        const inicioDia = new Date(hoy.setHours(0, 0, 0, 0));
        const finDia = new Date(hoy.setHours(23, 59, 59, 999));

        const [
            totalPacientes,
            medicamentos,
            consultasHoy,
            consultasMes,
            ultimasConsultas
        ] = await Promise.all([
            Paciente.countDocuments({ activo: true }),
            Medicamento.find({ activo: true }),
            Consulta.countDocuments({ fechaConsulta: { $gte: inicioDia, $lte: finDia } }),
            Consulta.countDocuments({
                fechaConsulta: { $gte: new Date(new Date().setDate(1)) }
            }),
            Consulta.find()
                .populate('paciente', 'nombre apellido codigoAcademico grado')
                .populate('encargado', 'nombre')
                .sort({ fechaConsulta: -1 })
                .limit(5)
        ]);

        const medicamentosDisponibles = medicamentos.filter(m => m.estado === 'DISPONIBLE').length;
        const medicamentosAgotados = medicamentos.filter(m => m.estado === 'AGOTADO').length;
        const medicamentosBajoStock = medicamentos.filter(m => m.estado === 'BAJO_STOCK').length;
        const medicamentosPorVencer = medicamentos.filter(m => m.estado === 'POR_VENCER').length;

        const alertas = medicamentos.filter(m =>
            m.estado === 'AGOTADO' || m.estado === 'BAJO_STOCK' || m.estado === 'POR_VENCER'
        );

        res.status(200).json({
            success: true,
            data: {
                estadisticas: {
                    totalPacientes,
                    consultasHoy,
                    consultasMes,
                    totalMedicamentos: medicamentos.length,
                    medicamentosDisponibles,
                    medicamentosAgotados,
                    medicamentosBajoStock,
                    medicamentosPorVencer
                },
                alertas,
                ultimasConsultas
            }
        });
    } catch (error) {
        next(error);
    }
};
