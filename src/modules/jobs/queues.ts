import { Queue } from 'bullmq';
import { config } from '../../config';
import { logger } from '../../core/logger';

// Queues
export const imageQueue = new Queue('image-processing', {
    connection: config.redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
    },
});

export const cleanupQueue = new Queue('file-cleanup', {
    connection: config.redis,
});

logger.info('Queues initialized');
