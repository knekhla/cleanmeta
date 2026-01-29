
import { FastifyInstance } from 'fastify';
import { paymentController } from './payment.controller';
import { authenticate } from '../auth/auth.middleware';

export async function paymentRoutes(server: FastifyInstance) {
    // Create a checkout session (Protected - user must be logged in)
    server.post('/api/payment/create-checkout-session', { preHandler: authenticate }, paymentController.createCheckoutSession);

    // Webhook listener (Public, called by Stripe)
    // Note: Needs raw body for signature verification - Fastify handles this via content-parser if configured, 
    // or we might need to adjust body parsing to keep raw buffer.
    server.post('/api/webhooks/stripe', paymentController.handleWebhook);
}
