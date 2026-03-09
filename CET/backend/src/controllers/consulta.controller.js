'use strict';

import Consulta from '../models/consulta.model.js';
import Medicamento from '../models/medicamento.model.js';
import Paciente from '../models/paciente.model.js';

export const getConsultas = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, paciente, fecha } = req.query;
        const skip = (page - 1) * limit;

        const query = {};
        if (paciente) query.paciente = paciente;
        if (fecha) {
            const inicio = new Date(fecha);
            const fin = new Date(fecha);
            fin.setDate(fin.getDate() + 1);
            query.fechaConsulta = { $gte: inicio, $lt: fin };
        }

        const [consultas, total] = await Promise.all([
            Consulta.find(query)
                .populate('paciente', 'nombre apellido codigoAcademico grado')
                .populate('encargado', 'nombre')
                .skip(skip)
                .limit(Number(limit))
                .sort({ fechaConsulta: -1 }),
            Consulta.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: consultas,
            pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        next(error);
    }
};

export const getConsultaById = async (req, res, next) => {
    try {
        const consulta = await Consulta.findById(req.params.id)
            .populate('paciente')
            .populate('encargado', 'nombre email');

        if (!consulta) {
            return res.status(404).json({ success: false, message: 'Consulta no encontrada' });
        }

        res.status(200).json({ success: true, data: consulta });
    } catch (error) {
        next(error);
    }
};

export const createConsulta = async (req, res, next) => {
    try {
        const { paciente: pacienteId, medicamentosSuministrados = [], ...resto } = req.body;

        // Verificar paciente
        const paciente = await Paciente.findById(pacienteId);
        if (!paciente) {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
        }

        // Verificar y descontar stock de medicamentos
        for (const item of medicamentosSuministrados) {
            const med = await Medicamento.findById(item.medicamento);
            if (!med) {
                return res.status(404).json({ success: false, message: `Medicamento ${item.medicamento} no encontrado` });
            }
            if (med.cantidad < item.cantidad) {
                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente para ${med.nombre}. Disponible: ${med.cantidad}`
                });
            }
            item.nombreMedicamento = med.nombre;
        }

        // Crear consulta
        const consulta = await Consulta.create({
            paciente: pacienteId,
            encargado: req.usuario._id,
            medicamentosSuministrados,
            ...resto
        });

        // Descontar stock
        for (const item of medicamentosSuministrados) {
            await Medicamento.findByIdAndUpdate(item.medicamento, {
                $inc: { cantidad: -item.cantidad }
            });
        }

        const consultaPopulada = await Consulta.findById(consulta._id)
            .populate('paciente', 'nombre apellido codigoAcademico grado')
            .populate('encargado', 'nombre');

        res.status(201).json({
            success: true,
            message: 'Consulta registrada exitosamente',
            data: consultaPopulada
        });
    } catch (error) {
        next(error);
    }
};

export const updateConsulta = async (req, res, next) => {
    try {
        const { medicamentosSuministrados, ...resto } = req.body;
        const consulta = await Consulta.findByIdAndUpdate(
            req.params.id,
            resto,
            { new: true, runValidators: true }
        ).populate('paciente', 'nombre apellido codigoAcademico')
         .populate('encargado', 'nombre');

        if (!consulta) {
            return res.status(404).json({ success: false, message: 'Consulta no encontrada' });
        }

        res.status(200).json({ success: true, message: 'Consulta actualizada', data: consulta });
    } catch (error) {
        next(error);
    }
};
