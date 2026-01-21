import { FastifyInstance } from 'fastify';
import { uploadController } from './upload.controller';

export async function uploadRoutes(server: FastifyInstance) {
    server.post('/api/process/single', uploadController.processSingle);
}
