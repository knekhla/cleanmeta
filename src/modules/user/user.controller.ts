
import { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../../core/supabase';
import { logger } from '../../core/logger';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export class UserController {

    async getDashboardData(req: FastifyRequest, reply: FastifyReply) {
        const user = (req as any).user;

        try {
            // Fetch Profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            // Fetch Usage Stats (e.g. from Redis or DB logs if implemented)
            // For now, mock or use profile.usage_count

            return reply.send({
                profile: profile || { tier: 'ghost', usage_limit: 5, usage_count: 0 },
                subscription: {
                    plan: profile?.tier || 'ghost',
                    status: profile?.subscription_status || 'active'
                }
            });

        } catch (error: any) {
            logger.error({ msg: 'Failed to fetch dashboard data', error });
            // Return defaults if profile missing (handling first login before trigger runs?)
            return reply.send({
                profile: { tier: 'ghost', usage_limit: 5, usage_count: 0 },
                subscription: { plan: 'ghost', status: 'active' }
            });
        }
    }

    async createApiKey(req: FastifyRequest, reply: FastifyReply) {
        const user = (req as any).user;
        const { name } = req.body as { name: string };

        // Generate Key: cm_sk_...
        const rawKey = `cm_sk_${uuidv4().replace(/-/g, '')}`;
        const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
        const keyPrefix = rawKey.substring(0, 10); // "cm_sk_..."

        try {
            const { data, error } = await supabase
                .from('api_keys')
                .insert({
                    user_id: user.id,
                    key_hash: keyHash,
                    key_prefix: keyPrefix,
                    name: name || 'API Key'
                })
                .select()
                .single();

            if (error) throw error;

            // Return raw key ONLY ONCE
            return reply.send({ apiKey: rawKey, meta: data });

        } catch (error: any) {
            logger.error({ msg: 'Failed to create API key', error });
            return reply.status(500).send({ error: 'Failed to create key' });
        }
    }

    async listApiKeys(req: FastifyRequest, reply: FastifyReply) {
        const user = (req as any).user;

        const { data } = await supabase
            .from('api_keys')
            .select('id, name, key_prefix, created_at, last_used_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        return reply.send(data || []);
    }

    async deleteApiKey(req: FastifyRequest, reply: FastifyReply) {
        const user = (req as any).user;
        const { id } = req.params as { id: string };

        await supabase
            .from('api_keys')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        return reply.send({ success: true });
    }
}

export const userController = new UserController();
