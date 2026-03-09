'use strict';

import Medicamento from '../models/medicamento.model.js';

export const getMedicamentos = async (req, res, next) => {
    try {
        const { search, estado, categoria } = req.query;

        const query = { activo: true };
        if (categoria) query.categoria = categoria;
        if (search) {
            query.nombre = { $regex: search, $options: 'i' };
        }

        const medicamentos = await Medicamento.find(query).sort({ nombre: 1 });

        // Filtrar por estado virtual si se solicita
        let resultado = medicamentos;
        if (estado) {
            resultado = medicamentos.filter(m => m.estado === estado.toUpperCase());
        }

        res.status(200).json({
            success: true,
            data: resultado,
            total: resultado.length
        });
    } catch (error) {
        next(error);
    }
};

export const getMedicamentoById = async (req, res, next) => {
    try {
        const medicamento = await Medicamento.findById(req.params.id);
        if (!medicamento) {
            return res.status(404).json({ success: false, message: 'Medicamento no encontrado' });
        }
        res.status(200).json({ success: true, data: medicamento });
    } catch (error) {
        next(error);
    }
};

export const createMedicamento = async (req, res, next) => {
    try {
        const medicamento = await Medicamento.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Medicamento registrado exitosamente',
            data: medicamento
        });
    } catch (error) {
        next(error);
    }
};

export const updateMedicamento = async (req, res, next) => {
    try {
        const medicamento = await Medicamento.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!medicamento) {
            return res.status(404).json({ success: false, message: 'Medicamento no encontrado' });
        }
        res.status(200).json({
            success: true,
            message: 'Medicamento actualizado',
            data: medicamento
        });
    } catch (error) {
        next(error);
    }
};

export const deleteMedicamento = async (req, res, next) => {
    try {
        const medicamento = await Medicamento.findByIdAndUpdate(
            req.params.id,
            { activo: false },
            { new: true }
        );
        if (!medicamento) {
            return res.status(404).json({ success: false, message: 'Medicamento no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Medicamento eliminado' });
    } catch (error) {
        next(error);
    }
};

export const ajustarStock = async (req, res, next) => {
    try {
        const { cantidad, tipo } = req.body; // tipo: 'ENTRADA' | 'SALIDA'
        const medicamento = await Medicamento.findById(req.params.id);

        if (!medicamento) {
            return res.status(404).json({ success: false, message: 'Medicamento no encontrado' });
        }

        if (tipo === 'SALIDA' && medicamento.cantidad < cantidad) {
            return res.status(400).json({ success: false, message: 'Stock insuficiente' });
        }

        medicamento.cantidad = tipo === 'ENTRADA'
            ? medicamento.cantidad + cantidad
            : medicamento.cantidad - cantidad;

        await medicamento.save();

        res.status(200).json({
            success: true,
            message: `Stock ${tipo === 'ENTRADA' ? 'aumentado' : 'reducido'}`,
            data: medicamento
        });
    } catch (error) {
        next(error);
    }
};

export const getAlertas = async (req, res, next) => {
    try {
        const medicamentos = await Medicamento.find({ activo: true });
        const alertas = medicamentos.filter(m =>
            m.estado === 'AGOTADO' || m.estado === 'BAJO_STOCK' || m.estado === 'POR_VENCER'
        );

        res.status(200).json({
            success: true,
            data: alertas,
            total: alertas.length
        });
    } catch (error) {
        next(error);
    }
};
