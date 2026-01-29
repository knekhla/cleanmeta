
import { FastifyRequest, FastifyReply } from 'fastify';
import Stripe from 'stripe';
import { supabase } from '../../core/supabase';
import { logger } from '../../core/logger';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // apiVersion: '2024-12-18.acacia', // Let SDK decide default
});

export class PaymentController {

    async createCheckoutSession(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { priceId } = req.body as { priceId: string };
            const user = (req as any).user; // Populated by authenticate middleware

            if (!priceId) {
                return reply.status(400).send({ error: 'Price ID is required' });
            }

            const session = await stripe.checkout.sessions.create({
                customer_email: user.email,
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription', // or 'payment' for one-time
                success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cleanmeta.artifyapi.com'}/dashboard?success=true`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cleanmeta.artifyapi.com'}/?canceled=true`,
                metadata: {
                    userId: user.id, // Important: to link payment to user in webhook
                    app: 'cleanmeta' // Safety check for shared Stripe account
                },
            });

            return reply.send({ url: session.url });

        } catch (error: any) {
            logger.error({ msg: 'Stripe session creation failed', error: error.message });
            return reply.status(500).send({ error: error.message });
        }
    }

    async handleWebhook(req: FastifyRequest, reply: FastifyReply) {
        const sig = req.headers['stripe-signature'] as string;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

        let event: Stripe.Event;

        try {
            // Fastify with fastify-raw-body plugin needed for this, 
            // OR assuming req.rawBody is available if configured.
            // For now, let's assume standard usage, but this is a common failure point in Node.
            // We might need to adjust app.ts to support raw body.
            event = stripe.webhooks.constructEvent((req as any).rawBody || req.body, sig, webhookSecret);
        } catch (err: any) {
            logger.error(`Webhook Error: ${err.message}`);
            return reply.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the events
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                await this.fulfillOrder(session);
                break;
            case 'invoice.payment_succeeded':
                // Optional: extend subscription logic
                break;
            default:
                logger.info(`Unhandled event type ${event.type}`);
        }

        return reply.send({ received: true });
    }

    private async fulfillOrder(session: Stripe.Checkout.Session) {
        // Verify this payment belongs to CleanMeta
        if (session.metadata?.app !== 'cleanmeta') {
            logger.info({ msg: 'Ignoring payment from another app', appId: session.metadata?.app });
            return;
        }

        const userId = session.metadata?.userId;
        if (!userId) return;

        logger.info({ msg: 'Fulfilling order for user', userId });

        // Update Supabase user profile/metadata
        // This assumes we have a table 'profiles' or we update auth.users app_metadata via admin client?
        // Updating auth.users metadata is cleaner for simple roles.

        const { error } = await supabase.auth.admin.updateUserById(
            userId,
            { app_metadata: { tier: 'spectre', subscription_status: 'active' } }
        );

        if (error) {
            logger.error({ msg: 'Failed to update user tier', error });
        } else {
            logger.info({ msg: 'User tier updated to SPECTRE', userId });
        }
    }
}

export const paymentController = new PaymentController();
