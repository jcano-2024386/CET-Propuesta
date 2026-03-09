'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import { requestLimit } from '../middlewares/request-limit.js';

// Routes
import authRoutes from '../src/routes/auth.routes.js';
import pacienteRoutes from '../src/routes/paciente.routes.js';
import medicamentoRoutes from '../src/routes/medicamento.routes.js';
import consultaRoutes from '../src/routes/consulta.routes.js';
import dashboardRoutes from '../src/routes/dashboard.routes.js';

const BASE_PATH = '/api/v1';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
    }));
    app.use(helmet());
    app.use(requestLimit);
    app.use(morgan('dev'));
};

const routes = (app) => {
    app.use(`${BASE_PATH}/auth`, authRoutes);
    app.use(`${BASE_PATH}/pacientes`, pacienteRoutes);
    app.use(`${BASE_PATH}/medicamentos`, medicamentoRoutes);
    app.use(`${BASE_PATH}/consultas`, consultaRoutes);
    app.use(`${BASE_PATH}/dashboard`, dashboardRoutes);

    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            service: 'CET - Clínica Estudiantil Técnica'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado'
        });
    });
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 5000;
    try {
        await dbConnection();
        middlewares(app);
        routes(app);
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`\n🏥 CET Server corriendo en puerto ${PORT}`);
            console.log(`📍 Health: http://localhost:${PORT}${BASE_PATH}/health\n`);
        });
    } catch (error) {
        console.error(`Error iniciando servidor: ${error.message}`);
        process.exit(1);
    }
};
