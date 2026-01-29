import { FastifyReply, FastifyRequest } from 'fastify';
import { supabase } from '../../core/supabase';

declare module 'fastify' {
    interface FastifyRequest {
        user?: any;
    }
}

import crypto from 'crypto';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    const apiKeyHeader = request.headers['x-api-key'] as string;

    // 1. Check for API Key (External Access)
    if (apiKeyHeader) {
        // Expected format: cm_sk_.... (raw key)
        // Store hash: sha256(rawKey)
        const keyHash = crypto.createHash('sha256').update(apiKeyHeader).digest('hex');

        const { data: apiKeyData, error } = await supabase
            .from('api_keys')
            .select('user_id, id')
            .eq('key_hash', keyHash)
            .single();

        if (error || !apiKeyData) {
            return reply.status(401).send({ error: 'Invalid API Key' });
        }

        // Update usage stats (fire and forget)
        supabase.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', apiKeyData.id).then();

        // Fetch minimal user profile or just attach ID
        // For full compatibility, we might need email etc, but for processing user_id is properly enough?
        // Let's verify user existence to be safe or just use ID.
        // Attaching { id: ... } is enough for RLS policies if we use supabase-js with service role, 
        // BUT standard supabase client in routes uses `auth.users`, so we might need `supabase.auth.admin.getUserById` if we need full user object.
        // However, most routes just need `request.user.id`.
        request.user = { id: apiKeyData.user_id };
        return;
    }

    // 2. Check for JWT (Frontend Access)
    if (!authHeader) {
        return reply.status(401).send({ error: 'Missing Authorization header or API Key' });
    }

    const token = authHeader.replace('Bearer ', '');

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return reply.status(401).send({ error: 'Invalid or expired token' });
    }

    request.user = user;
};
