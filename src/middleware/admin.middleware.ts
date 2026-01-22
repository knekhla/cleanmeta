import { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../core/supabase';
import { config } from '../config';
import { logger } from '../core/logger';

export async function adminMiddleware(req: FastifyRequest, reply: FastifyReply) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return reply.status(401).send({ error: 'Missing authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    // verify the token using Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user || !user.email) {
        logger.warn({ msg: 'Admin auth failed', error });
        return reply.status(401).send({ error: 'Unauthorized' });
    }

    if (!config.adminEmails.includes(user.email)) {
        logger.warn({ msg: 'Admin access denied', email: user.email });
        return reply.status(403).send({ error: 'Forbidden' });
    }

    // Pass
}
