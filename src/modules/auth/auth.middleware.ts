import { FastifyReply, FastifyRequest } from 'fastify';
import { supabase } from '../../core/supabase';

declare module 'fastify' {
    interface FastifyRequest {
        user?: any;
    }
}

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return reply.status(401).send({ error: 'Missing Authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return reply.status(401).send({ error: 'Invalid or expired token' });
    }

    request.user = user;
};
