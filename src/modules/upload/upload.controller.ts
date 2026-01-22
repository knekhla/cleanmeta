import { FastifyRequest, FastifyReply } from 'fastify';
import { processingService } from '../processing/processing.service';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../core/logger';
import { statsService } from '../admin/stats.service';

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

            // Process file (Image or Video)
            const { outputPath, report, stats } = await processingService.processFile(inputPath, data.mimetype);

            // Log success stats
            statsService.logStat({
                file_type: data.mimetype.startsWith('video/') ? 'video' : 'image',
                mime_type: stats.mimeType,
                size_bytes: stats.sizeBytes,
                processing_time_ms: stats.processingTimeMs,
                meta_gps_found: stats.meta_gps_found,
                meta_device_found: stats.meta_device_found,
                meta_ai_found: stats.meta_ai_found,
                device_model: stats.device_model,
                status: 'success'
            });

            // Return processed image
            // For immediate download:
            const buffer = await fs.readFile(outputPath);

            // Cleanup temp files
            await Promise.all([
                fs.unlink(inputPath).catch(() => { }),
                fs.unlink(outputPath).catch(() => { })
            ]);

            reply.header('Content-Disposition', `attachment; filename="clean_${data.filename}"`);
            reply.header('X-Clean-GPS', report.gps ? 'true' : 'false');
            reply.header('X-Clean-Device', report.device ? encodeURIComponent(report.device) : '');
            reply.header('X-Clean-AI', report.ai ? 'true' : 'false');

            reply.header('Access-Control-Expose-Headers', 'X-Clean-GPS, X-Clean-Device, X-Clean-AI, Content-Disposition');

            reply.type(data.mimetype);
            return reply.send(buffer);

        } catch (error) {
            logger.error({ msg: 'Upload processing failed', error });

            // Log error stats
            try {
                const fileStats = await fs.stat(inputPath).catch(() => ({ size: 0 }));
                statsService.logStat({
                    file_type: data.mimetype.startsWith('video/') ? 'video' : 'image',
                    mime_type: data.mimetype,
                    size_bytes: fileStats.size,
                    processing_time_ms: 0,
                    meta_gps_found: false,
                    meta_device_found: false,
                    meta_ai_found: false,
                    device_model: null,
                    status: 'error'
                });
            } catch (logErr) {
                // Ignore logging errors
            }

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

    async getSample(req: FastifyRequest, reply: FastifyReply) {
        try {
            const samplePath = await processingService.generateSampleImage();
            const buffer = await fs.readFile(samplePath);

            // Cleanup async
            fs.unlink(samplePath).catch(() => { });

            reply.header('Content-Disposition', 'attachment; filename="cleanmeta_sample_with_metadata.jpg"');
            reply.type('image/jpeg');
            return reply.send(buffer);
        } catch (error) {
            logger.error({ msg: 'Failed to generate sample', error });
            return reply.status(500).send({ error: 'Failed to generate sample' });
        }
    }
}

export const uploadController = new UploadController();
