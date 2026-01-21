import { buildApp } from '../src/app';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';


// Mock request using fastify inject is easier, but for multipart it can be tricky.
// We'll use fastify.inject with formData.

async function runTest() {
    const server = buildApp();

    // 1. Create a dummy image
    const dummyPath = path.join(__dirname, 'test-image.jpg');
    await sharp({
        create: {
            width: 100,
            height: 100,
            channels: 3,
            background: { r: 255, g: 0, b: 0 }
        }
    })
        .jpeg()
        .toFile(dummyPath);

    console.log('Dummy image created');

    try {
        // 2. Upload image via Inject
        // fastify-multipart with inject needs special handling or raw headers
        // Using form-data package to generate headers and payload

        // Manual multipart construction to avoid extra dependencies
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        const crlf = '\r\n';
        const filename = path.basename(dummyPath);
        const fileContent = fs.readFileSync(dummyPath);

        const payload = Buffer.concat([
            Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="file"; filename="${filename}"${crlf}Content-Type: image/jpeg${crlf}${crlf}`),
            fileContent,
            Buffer.from(`${crlf}--${boundary}--${crlf}`),
        ]);

        const headers = {
            'Content-Type': `multipart/form-data; boundary=${boundary}`
        };

        const response = await server.inject({
            method: 'POST',
            url: '/api/process/single',
            headers: headers,
            payload: payload
        });

        console.log('Response Status:', response.statusCode);

        if (response.statusCode === 200) {
            console.log('Success! Image processed.');
            // Verify output is an image
            const outputBuffer = response.rawPayload;
            const meta = await sharp(outputBuffer).metadata();
            console.log('Output format:', meta.format);
            console.log('Output size:', meta.size);
        } else {
            console.error('Failed:', response.payload);
            process.exit(1);
        }

    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    } finally {
        // Cleanup
        if (fs.existsSync(dummyPath)) fs.unlinkSync(dummyPath);
    }
}

runTest();
