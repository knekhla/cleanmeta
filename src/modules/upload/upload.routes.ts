import { FastifyInstance } from 'fastify';
import { uploadController } from './upload.controller';

import { authenticate } from '../auth/auth.middleware';

export async function uploadRoutes(server: FastifyInstance) {
    // Public route for single image processing (Landing page demo)
    server.post('/api/process/single', uploadController.processSingle);
    server.get('/api/sample', uploadController.getSample);

    // Protected route for batch processing (Premium/Logged-in)
    server.post('/api/process/batch', { preHandler: authenticate }, uploadController.processBatch);
}
