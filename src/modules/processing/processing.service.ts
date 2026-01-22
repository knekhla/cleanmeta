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
    async processImage(inputPath: string): Promise<{ outputPath: string; report: any; stats: any }> {
        const startTime = Date.now();
        const tempDir = os.tmpdir();
        const ext = path.extname(inputPath) || '.jpg';
        const outputPath = path.join(tempDir, `processed-${uuidv4()}${ext}`);

        try {
            const stats = await fs.stat(inputPath);
            const sizeBytes = stats.size;

            logger.info({ msg: 'Starting metadata removal', inputPath });

            // Step 1: Analyze Metadata (Privacy Audit)
            const tags = await exiftool.read(inputPath) as any;

            // Deep scan for AI signatures in ANY tag
            const aiKeywords = [/Midjourney/i, /Stable Diffusion/i, /DALL\.E/i, /Steps: \d+/, /Cfg scale:/i, /Negative prompt:/i];
            const hasAiSignature = Object.values(tags).some(val =>
                typeof val === 'string' && aiKeywords.some(regex => regex.test(val))
            );

            const report = {
                gps: (tags.GPSLatitude || tags.GPSLongitude) ? true : false,
                device: (tags.Make || tags.Model) ? `${tags.Make || ''} ${tags.Model || ''}`.trim() : null,
                ai: hasAiSignature
            };

            // Step 2: Strip all tags
            await exiftool.write(inputPath, {}, ['-all=', '-png:all=', '-overwrite_original']);

            // Step 3: Re-encode with Sharp
            await sharp(inputPath)
                .rotate()
                .toFile(outputPath);

            logger.info({ msg: 'Image processed successfully', outputPath, report });

            return {
                outputPath,
                report,
                stats: {
                    processingTimeMs: Date.now() - startTime,
                    sizeBytes,
                    mimeType: 'image/jpeg', // approximate, or use external detection if needed
                    meta_gps_found: report.gps,
                    meta_device_found: !!report.device,
                    meta_ai_found: report.ai,
                    device_model: report.device
                }
            };

        } catch (error: any) {
            logger.error({ msg: 'Error processing image', error: error.message });
            throw error;
        }
    }

    async processVideo(inputPath: string): Promise<{ outputPath: string; report: any; stats: any }> {
        const startTime = Date.now();
        const tempDir = os.tmpdir();
        const ext = path.extname(inputPath) || '.mp4';
        const outputPath = path.join(tempDir, `processed-${uuidv4()}${ext}`);

        try {
            const fileStats = await fs.stat(inputPath);
            const sizeBytes = fileStats.size;

            return new Promise((resolve, reject) => {
                const ffmpeg = require('fluent-ffmpeg');
                logger.info({ msg: 'Starting video metadata removal', inputPath });

                ffmpeg(inputPath)
                    .outputOptions('-map_metadata', '-1')
                    .outputOptions('-c', 'copy')
                    .save(outputPath)
                    .on('end', () => {
                        logger.info({ msg: 'Video processed successfully', outputPath });
                        resolve({
                            outputPath,
                            report: { gps: false, device: null, ai: false },
                            stats: {
                                processingTimeMs: Date.now() - startTime,
                                sizeBytes,
                                mimeType: 'video/mp4',
                                meta_gps_found: false,
                                meta_device_found: false,
                                meta_ai_found: false,
                                device_model: null
                            }
                        });
                    })
                    .on('error', (err: any) => {
                        logger.error({ msg: 'Video processing error', err });
                        reject(err);
                    });
            });
        } catch (error) {
            throw error;
        }
    }

    async processFile(inputPath: string, mimetype: string): Promise<{ outputPath: string; report: any; stats: any }> {
        if (mimetype.startsWith('video/')) {
            const result = await this.processVideo(inputPath);
            result.stats.mimeType = mimetype; // Update with actual mime
            return result;
        }
        const result = await this.processImage(inputPath);
        result.stats.mimeType = mimetype;
        return result;
    }

    async cleanup(filePath: string) {
        try {
            await fs.unlink(filePath);
        } catch (err) {
            // ignore
        }
    }

    async generateSampleImage(): Promise<string> {
        const tempDir = os.tmpdir();
        const outputPath = path.join(tempDir, `sample-${uuidv4()}.jpg`);

        // Valid 1x1 pixel white JPEG
        const base64Image = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==';

        await fs.writeFile(outputPath, Buffer.from(base64Image, 'base64'));

        // Inject dummy metadata
        await exiftool.write(outputPath, {
            GPSLatitude: 48.8566,
            GPSLongitude: 2.3522,
            Software: 'Stable Diffusion v1.5', // AI Trigger
            Make: 'Apple',
            Model: 'iPhone 15 Pro Test',
            UserComment: 'This is a sample image to test CleanMeta privacy report.'
        });

        return outputPath;
    }
}

export const processingService = new ProcessingService();
