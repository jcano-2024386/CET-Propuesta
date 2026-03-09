'use strict';

import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.model.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email, activo: true }).select('+password');
        if (!usuario) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const passwordValido = await usuario.comparePassword(password);
        if (!passwordValido) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const token = generateToken(usuario._id);

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            data: {
                token,
                usuario: usuario.toJSON()
            }
        });
    } catch (error) {
        next(error);
    }
};

export const register = async (req, res, next) => {
    try {
        const { nombre, email, password, rol } = req.body;

        const existe = await Usuario.findOne({ email });
        if (existe) {
            return res.status(400).json({ success: false, message: 'El email ya está registrado' });
        }

        const usuario = await Usuario.create({ nombre, email, password, rol: rol || 'ENCARGADO' });

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: usuario.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.usuario
    });
};

export const changePassword = async (req, res, next) => {
    try {
        const { passwordActual, passwordNuevo } = req.body;
        const usuario = await Usuario.findById(req.usuario._id).select('+password');

        const valido = await usuario.comparePassword(passwordActual);
        if (!valido) {
            return res.status(400).json({ success: false, message: 'Contraseña actual incorrecta' });
        }

        usuario.password = passwordNuevo;
        await usuario.save();

        res.status(200).json({ success: true, message: 'Contraseña actualizada' });
    } catch (error) {
        next(error);
    }
};
