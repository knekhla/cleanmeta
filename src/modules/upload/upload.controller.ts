import { FastifyRequest, FastifyReply } from 'fastify';
import { processingService } from '../processing/processing.service';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../core/logger';

export class UploadController {
    async processSingle(req: FastifyRequest, reply: FastifyReply) {
        const data = await req.file();
        if (!data) {
            return reply.status(400).send({ error: 'No file uploaded' });
        }

        const tempDir = os.tmpdir();
        // Use original filename extension if possible
        const ext = path.extname(data.filename) || '.jpg';
        const inputPath = path.join(tempDir, `upload-${uuidv4()}${ext}`);

        try {
            // Stream upload to temp file
            await pipeline(data.file, createWriteStream(inputPath));
            logger.info({ msg: 'File uploaded to temp', inputPath });

            // Process image
            const processedPath = await processingService.processImage(inputPath);

            // Return processed image
            // For immediate download:
            const buffer = await fs.readFile(processedPath);

            // Cleanup temp files
            await Promise.all([
                fs.unlink(inputPath).catch(() => { }),
                fs.unlink(processedPath).catch(() => { })
            ]);

            reply.header('Content-Disposition', `attachment; filename="clean_${data.filename}"`);
            reply.type(data.mimetype);
            return reply.send(buffer);

        } catch (error) {
            logger.error({ msg: 'Upload processing failed', error });
            // Try cleanup on error
            await fs.unlink(inputPath).catch(() => { });
            return reply.status(500).send({ error: 'Processing failed' });
        }
    }

    async processBatch(req: FastifyRequest, reply: FastifyReply) {
        const files = await req.files();
        const jobs = [];

        try {
            for await (const part of files) {
                if (!part.file) continue;

                const tempDir = os.tmpdir();
                const ext = path.extname(part.filename) || '.jpg';
                const inputPath = path.join(tempDir, `batch-${uuidv4()}${ext}`);

                await pipeline(part.file, createWriteStream(inputPath));

                // Add to BullMQ
                const job = await import('../jobs/queues').then(m => m.imageQueue.add('process-image', {
                    inputPath,
                    originalName: part.filename,
                    mimetype: part.mimetype
                }));

                jobs.push({ jobId: job.id, originalName: part.filename });
            }

            return reply.send({
                message: 'Batch processing started',
                jobs
            });
        } catch (error) {
            logger.error({ msg: 'Batch upload failed', error });
            return reply.status(500).send({ error: 'Batch processing failed' });
        }
    }
}

export const uploadController = new UploadController();
