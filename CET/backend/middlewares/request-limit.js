'use strict';

import rateLimit from 'express-rate-limit';

export const requestLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
