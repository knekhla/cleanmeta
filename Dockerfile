# Build Stage
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Stage
FROM node:20-slim

WORKDIR /app

# Install runtime dependencies (Exiftool, etc)
# exiftool-vendored usually bundles the binary, but having perl is often needed
RUN apt-get update && apt-get install -y \
    perl \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Create temp dir for uploads if needed
RUN mkdir -p /tmp

# Expose port (Internal container port)
EXPOSE 3000

# Start command
CMD ["node", "dist/server.js"]
