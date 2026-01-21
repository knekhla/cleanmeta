import { buildApp } from './app';
import { config } from './config';

const start = async () => {
    const server = buildApp();
    try {
        await server.listen({ port: config.port, host: '0.0.0.0' });
        console.log(`Server listening on port ${config.port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
