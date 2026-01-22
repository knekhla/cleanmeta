import { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../../core/supabase';
import { logger } from '../../core/logger';

export class AdminController {
    async getStats(req: FastifyRequest, reply: FastifyReply) {
        try {
            // Fetch basic counts
            const { count: totalFiles, error: countErr } = await supabase
                .from('stats_logs')
                .select('*', { count: 'exact', head: true });

            if (countErr) throw countErr;

            // Fetch specific flagged counts
            const { count: gpsCount } = await supabase
                .from('stats_logs')
                .select('*', { count: 'exact', head: true })
                .eq('meta_gps_found', true);

            const { count: deviceCount } = await supabase
                .from('stats_logs')
                .select('*', { count: 'exact', head: true })
                .eq('meta_device_found', true);

            const { count: aiCount } = await supabase
                .from('stats_logs')
                .select('*', { count: 'exact', head: true })
                .eq('meta_ai_found', true);

            const { count: errorCount } = await supabase
                .from('stats_logs')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'error');

            const { count: videoCount } = await supabase
                .from('stats_logs')
                .select('*', { count: 'exact', head: true })
                .eq('file_type', 'video');

            // For simple "Total Data" approximation, we'll fetch just size column of last 1000 records
            // to avoid massive payload, or assume average.
            // Actually, let's fetch all sizes, it's just an array of numbers.
            const { data: sizes } = await supabase.from('stats_logs').select('size_bytes, processing_time_ms');

            let totalBytes = 0;
            let totalTime = 0;
            let countForAvg = 0;

            if (sizes) {
                sizes.forEach(r => {
                    totalBytes += (r.size_bytes || 0);
                    if (r.processing_time_ms > 0) {
                        totalTime += r.processing_time_ms;
                        countForAvg++;
                    }
                });
            }

            const avgTime = countForAvg > 0 ? Math.round(totalTime / countForAvg) : 0;

            return reply.send({
                totalFiles: totalFiles || 0,
                totalBytes,
                avgProcessingTime: avgTime,
                gpsRemoved: gpsCount || 0,
                deviceInfoRemoved: deviceCount || 0,
                aiGenerationsDetected: aiCount || 0,
                errorRate: totalFiles ? ((errorCount || 0) / totalFiles) * 100 : 0,
                videoCount: videoCount || 0
            });

        } catch (error) {
            logger.error({ msg: 'Failed to fetch admin stats', error });
            return reply.status(500).send({ error: 'Failed to fetch stats' });
        }
    }

    async getLogs(req: FastifyRequest, reply: FastifyReply) {
        try {
            const page = parseInt((req.query as any).page) || 1;
            const limit = parseInt((req.query as any).limit) || 50;
            const start = (page - 1) * limit;
            const end = start + limit - 1;

            const { data, error, count } = await supabase
                .from('stats_logs')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(start, end);

            if (error) throw error;

            return reply.send({
                logs: data,
                total: count,
                page,
                limit
            });

        } catch (error) {
            logger.error({ msg: 'Failed to fetch logs', error });
            return reply.status(500).send({ error: 'Failed to fetch logs' });
        }
    }
}

export const adminController = new AdminController();
