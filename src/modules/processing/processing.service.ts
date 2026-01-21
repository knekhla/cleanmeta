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
    async processImage(inputPath: string): Promise<string> {
        const tempDir = os.tmpdir();
        const ext = path.extname(inputPath) || '.jpg';
        const outputPath = path.join(tempDir, `processed-${uuidv4()}${ext}`);

        try {
            logger.info({ msg: 'Starting metadata removal', inputPath });

            // Step 1: Strip metadata using Exiftool (Robust removal)
            // We overwrite the file or create a temp intermediate?
            // Exiftool usually modifies locally or creates _original.
            // Let's use Sharp for the final re-encoding which flushes most metadata anyway.
            // But Exiftool is safer for hidden/custom tags.

            // We will read metadata first to log what we found (optional audit)
            // const tags = await exiftool.read(inputPath);

            // Strip all tags using command line argument directly
            // Added -png:all= to specifically target Stable Diffusion/AI parameters in PNG chunks
            await exiftool.write(inputPath, {}, ['-all=', '-png:all=', '-overwrite_original']);

            // Step 2: Re-encode with Sharp to sanitize image structure (remove hidden chunks)
            // This is the "Privacy-First" guarantee: Re-create the image data.
            await sharp(inputPath)
                .rotate()
                // Removed .withMetadata() to ensure absolutely NO metadata is carried over.
                // Density will default to 72 or image default, which is fine for web.
                .toFile(outputPath);

            logger.info({ msg: 'Image processed successfully', outputPath });
            return outputPath;

        } catch (error) {
            logger.error({ msg: 'Error processing image', error });
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
