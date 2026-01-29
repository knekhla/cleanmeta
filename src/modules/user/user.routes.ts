
import { FastifyInstance } from 'fastify';
import { userController } from './user.controller';
import { authenticate } from '../auth/auth.middleware';

export async function userRoutes(server: FastifyInstance) {
    // Dashboard Data
    server.get('/api/user/dashboard', { preHandler: authenticate }, userController.getDashboardData);

    // API Key Management
    server.post('/api/user/keys', { preHandler: authenticate }, userController.createApiKey);
    server.get('/api/user/keys', { preHandler: authenticate }, userController.listApiKeys);
    server.delete('/api/user/keys/:id', { preHandler: authenticate }, userController.deleteApiKey);
}
