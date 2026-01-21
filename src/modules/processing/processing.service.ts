import { exiftool } from 'exiftool-vendored';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../../core/logger';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

export class ProcessingService {
    /**
     * Process a single image: Strip metadata using Exiftool, then re-encode with Sharp.
     * @param inputPath Path to the input file
     * @returns Path to the processed file
     */
    async processImage(inputPath: string): Promise<{ outputPath: string; report: any }> {
        const tempDir = os.tmpdir();
        const ext = path.extname(inputPath) || '.jpg';
        const outputPath = path.join(tempDir, `processed-${uuidv4()}${ext}`);

        try {
            logger.info({ msg: 'Starting metadata removal', inputPath });

            // Step 1: Analyze Metadata (Privacy Audit)
            const tags = await exiftool.read(inputPath) as any;

            const report = {
                gps: (tags.GPSLatitude || tags.GPSLongitude) ? true : false,
                device: tags.Model ? `${tags.Make || ''} ${tags.Model}`.trim() : null,
                // Check common AI signatures
                ai: (
                    (tags.Software && /Midjourney|Stable Diffusion/i.test(String(tags.Software))) ||
                    (tags.Parameters && /Steps:|Cfg scale/i.test(String(tags.Parameters))) ||
                    (tags['PNG:Parameters'] && /Steps:|Cfg scale/i.test(String(tags['PNG:Parameters'])))
                ) ? true : false
            };

            // Step 2: Strip all tags using command line argument directly
            // Added -png:all= to specifically target Stable Diffusion/AI parameters in PNG chunks
            await exiftool.write(inputPath, {}, ['-all=', '-png:all=', '-overwrite_original']);

            // Step 3: Re-encode with Sharp to sanitize image structure (remove hidden chunks)
            // This is the "Privacy-First" guarantee: Re-create the image data.
            await sharp(inputPath)
                .rotate()
                // Removed .withMetadata() to ensure absolutely NO metadata is carried over.
                // Density will default to 72 or image default, which is fine for web.
                .toFile(outputPath);

            logger.info({ msg: 'Image processed successfully', outputPath, report });
            return { outputPath, report };

        } catch (error: any) {
            logger.error({
                msg: 'Error processing image',
                error: error.message || error,
                stack: error.stack
            });
            throw error;
        }
    }

    async cleanup(filePath: string) {
        try {
            await fs.unlink(filePath);
        } catch (err) {
            // ignore
        }
    }
}

export const processingService = new ProcessingService();
