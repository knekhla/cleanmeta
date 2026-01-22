import { FastifyInstance } from 'fastify';
import { adminController } from './admin.controller';
import { adminMiddleware } from '../../middleware/admin.middleware';

export async function adminRoutes(fastify: FastifyInstance) {
    // Protect all routes in this context with admin authentication
    fastify.addHook('preHandler', adminMiddleware);

    fastify.get('/stats', adminController.getStats);
    fastify.get('/logs', adminController.getLogs);
}
