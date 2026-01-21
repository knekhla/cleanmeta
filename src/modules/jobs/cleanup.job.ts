import { Worker, Queue } from 'bullmq';
import { config } from '../../config';
import { logger } from '../../core/logger';
import { s3Client, BUCKET_NAME } from '../../core/storage';
import { ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

// Setup periodic cleanup job
export const cleanupQueue = new Queue('cleanup-schedule', {
    connection: config.redis,
});

export const cleanupWorker = new Worker('cleanup-schedule', async (job) => {
    logger.info('Starting cleanup job');

    try {
        // Logic to list files older than X hours and delete them
        // This is complex with S3 (need to check LastModified)

        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
        });

        const response = await s3Client.send(command);

        if (!response.Contents || response.Contents.length === 0) {
            return;
        }

        const now = Date.now();
        const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

        const toDelete: string[] = [];

        for (const file of response.Contents) {
            if (file.LastModified && (now - file.LastModified.getTime() > MAX_AGE_MS)) {
                if (file.Key) toDelete.push(file.Key);
            }
        }

        if (toDelete.length > 0) {
            logger.info({ msg: 'Deleting expired files', count: toDelete.length });
            await s3Client.send(new DeleteObjectsCommand({
                Bucket: BUCKET_NAME,
                Delete: {
                    Objects: toDelete.map(key => ({ Key: key })),
                },
            }));
        }

    } catch (error) {
        logger.error({ msg: 'Cleanup job failed', error });
        throw error;
    }
}, {
    connection: config.redis,
});

// Function to schedule the job (call this on app startup if Redis available)
export async function scheduleCleanup() {
    await cleanupQueue.add('daily-cleanup', {}, {
        repeat: {
            every: 60 * 60 * 1000, // Every hour
        }
    });
}
