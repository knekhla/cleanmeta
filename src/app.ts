import Fastify from 'fastify';
import { config } from './config';
import { logger } from './core/logger';

import multipart from '@fastify/multipart';
import { uploadRoutes } from './modules/upload/upload.routes';

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

    server.register(multipart);
    server.register(uploadRoutes);

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
