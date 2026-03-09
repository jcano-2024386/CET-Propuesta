'use strict';

import jwt from 'jsonwebtoken';
import Usuario from '../src/models/usuario.model.js';

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token requerido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findById(decoded.id).select('-password');
        if (!usuario || !usuario.activo) {
            return res.status(401).json({ success: false, message: 'Usuario no autorizado' });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        next(error);
    }
};

export const verifyRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({ success: false, message: 'Acceso denegado' });
        }
        next();
    };
};
