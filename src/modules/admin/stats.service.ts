import { supabase } from '../../core/supabase';
import { logger } from '../../core/logger';

export interface ProcessingStat {
    file_type: 'image' | 'video';
    mime_type: string;
    size_bytes: number;
    processing_time_ms: number;
    meta_gps_found: boolean;
    meta_device_found: boolean;
    meta_ai_found: boolean;
    device_model?: string | null;
    status: 'success' | 'error';
}

export class StatsService {
    /**
     * Log anonymous processing statistics to Supabase
     * Fire-and-forget: errors are logged but don't stop the request
     */
    async logStat(stat: ProcessingStat) {
        try {
            const { error } = await supabase
                .from('stats_logs')
                .insert([stat]);

            if (error) {
                logger.error({ msg: 'Failed to log stats', error });
            }
        } catch (error) {
            logger.error({ msg: 'Error in stats logging', error });
        }
    }
}

export const statsService = new StatsService();
