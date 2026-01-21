import { FastifyInstance } from 'fastify';
import { uploadController } from './upload.controller';

import { authenticate } from '../auth/auth.middleware';

export async function uploadRoutes(server: FastifyInstance) {
    server.post('/api/process/single', { preHandler: authenticate }, uploadController.processSingle);
}
