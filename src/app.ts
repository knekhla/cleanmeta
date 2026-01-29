import Fastify from 'fastify';
import { config } from './config';
import { logger } from './core/logger';

import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { uploadRoutes } from './modules/upload/upload.routes';
import { adminRoutes } from './modules/admin/admin.routes';
import { paymentRoutes } from './modules/payment/payment.routes';
import { userRoutes } from './modules/user/user.routes';

export const buildApp = () => {
    const server = Fastify({
        logger: {
            level: config.logLevel,
            transport: {
                target: 'pino-pretty',
                options: {
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                },
            },
        },
    });

    server.register(cors, {
        origin: true, // Allow all origins (for now, to support IP access)
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    });

    server.register(multipart, {
        limits: {
            fileSize: 50 * 1024 * 1024, // 50MB
        }
    });
    server.register(uploadRoutes);
    server.register(paymentRoutes);
    server.register(userRoutes);
    server.register(adminRoutes, { prefix: '/api/admin' });

    // Root Endpoint
    server.get('/', async () => {
        return {
            service: 'CleanMeta API',
            version: '1.0.0',
            status: 'active',
            endpoints: {
                health: '/health',
                process: '/api/process/single'
            }
        };
    });

    server.get('/health', async () => {
        return { status: 'ok', version: '1.0.0' };
    });

    return server;
};
