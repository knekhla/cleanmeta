import { Worker, Job } from 'bullmq';
import { config } from '../../config';
import { logger } from '../../core/logger';
import { processingService } from '../processing/processing.service';
import fs from 'fs/promises';

export const batchWorker = new Worker('image-processing', async (job: Job) => {
    logger.info({ msg: 'Processing job', jobId: job.id, data: job.data });

    const { inputPath, outputPath } = job.data;

    if (!inputPath) {
        throw new Error('Missing inputPath');
    }

    try {
        // Process image
        const processedPath = await processingService.processImage(inputPath);

        // In a real batch scenario, we might upload to S3 or notify user here.
        // For now, we assume "processing" is the goal.

        // Example: Move processed file to final destination if specified
        if (outputPath) {
            await fs.rename(processedPath, outputPath);
        } else {
            // If no output path, maybe we just leave it for now (or upload logic goes here)
            // Cleanup temp processed file to avoid filling disk if not moved
            await processingService.cleanup(processedPath);
        }

        return { success: true, processedPath };
    } catch (error) {
        logger.error({ msg: 'Job failed', jobId: job.id, error });
        throw error;
    }
}, {
    connection: config.redis,
    concurrency: 5, // Process 5 images in parallel
});

batchWorker.on('completed', job => {
    logger.info({ msg: 'Job completed', jobId: job.id });
});

batchWorker.on('failed', (job, err) => {
    logger.info({ msg: 'Job failed', jobId: job?.id, error: err });
});
