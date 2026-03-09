'use strict';

import Paciente from '../models/paciente.model.js';
import Consulta from '../models/consulta.model.js';

export const getPacientes = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, activo } = req.query;
        const skip = (page - 1) * limit;

        const query = {};
        if (activo !== undefined) query.activo = activo === 'true';
        if (search) {
            query.$or = [
                { codigoAcademico: { $regex: search, $options: 'i' } },
                { nombre: { $regex: search, $options: 'i' } },
                { apellido: { $regex: search, $options: 'i' } }
            ];
        }

        const [pacientes, total] = await Promise.all([
            Paciente.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
            Paciente.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: pacientes,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getPacienteById = async (req, res, next) => {
    try {
        const paciente = await Paciente.findById(req.params.id);
        if (!paciente) {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
        }
        res.status(200).json({ success: true, data: paciente });
    } catch (error) {
        next(error);
    }
};

export const getPacienteByCodigo = async (req, res, next) => {
    try {
        const paciente = await Paciente.findOne({
            codigoAcademico: req.params.codigo.toUpperCase()
        });
        if (!paciente) {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
        }
        res.status(200).json({ success: true, data: paciente });
    } catch (error) {
        next(error);
    }
};

export const createPaciente = async (req, res, next) => {
    try {
        const paciente = await Paciente.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Paciente registrado exitosamente',
            data: paciente
        });
    } catch (error) {
        next(error);
    }
};

export const updatePaciente = async (req, res, next) => {
    try {
        const paciente = await Paciente.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!paciente) {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
        }
        res.status(200).json({
            success: true,
            message: 'Paciente actualizado',
            data: paciente
        });
    } catch (error) {
        next(error);
    }
};

export const deletePaciente = async (req, res, next) => {
    try {
        const paciente = await Paciente.findByIdAndUpdate(
            req.params.id,
            { activo: false },
            { new: true }
        );
        if (!paciente) {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Paciente desactivado' });
    } catch (error) {
        next(error);
    }
};

export const getHistorialPaciente = async (req, res, next) => {
    try {
        const paciente = await Paciente.findById(req.params.id);
        if (!paciente) {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
        }

        const consultas = await Consulta.find({ paciente: req.params.id })
            .populate('encargado', 'nombre')
            .sort({ fechaConsulta: -1 });

        res.status(200).json({
            success: true,
            data: { paciente, consultas }
        });
    } catch (error) {
        next(error);
    }
};
