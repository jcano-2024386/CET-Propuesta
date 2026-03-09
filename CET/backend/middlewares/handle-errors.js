'use strict';

export const errorHandler = (err, req, res, next) => {
    console.error(`Error: ${err.message}`);

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message
        }));
        return res.status(400).json({ success: false, message: 'Error de validación', errors });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ success: false, message: `${field} ya existe` });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Token inválido' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expirado' });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor'
    });
};
