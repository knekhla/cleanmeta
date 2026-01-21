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
}

export const uploadController = new UploadController();
