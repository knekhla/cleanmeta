# Deploying CleanMeta to Hostinger VPS

## Prerequisites
- A VPS running **Ubuntu 22.04** or **24.04**.
- SSH Access to the server.
- A domain name pointing to your VPS IP address.

## Step 1: Server Provisioning
1. SSH into your server:
   ```bash
   ssh root@YOUR_VPS_IP
   ```
2. Upload the `deploy/setup.sh` script to your server (or create it locally).
   ```bash
   nano setup.sh
   # Paste content of deploy/setup.sh
   chmod +x setup.sh
   ./setup.sh
   ```

## Step 2: Code Deployment
1. Navigate to the app directory:
   ```bash
   cd /var/www/cleanmeta
   ```
2. **Option A (Git)**:
   ```bash
   git clone <your-repo-url> .
   ```
   **Option B (SCP/Upload)**:
   Upload your local project files (excluding `node_modules`) to `/var/www/cleanmeta`.

3. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

## Step 3: Configuration
1. Create `.env` file:
   ```bash
   cp .env.example .env
   nano .env
   ```
2. Update `.env` with production values:
   - `NODE_ENV=production`
   - `REDIS_HOST=localhost`
   - `S3_...` (Your S3 credentials)

## Step 4: Start Application
Use PM2 to keep the app running:
```bash
pm2 start dist/server.js --name cleanmeta
pm2 save
pm2 startup
```

## Step 5: Nginx & SSL
1. Configure Nginx:
   ```bash
   nano /etc/nginx/sites-available/cleanmeta
   # Paste content of deploy/nginx.conf (Replace YOUR_DOMAIN.com)
   ```
2. Enable site:
   ```bash
   ln -s /etc/nginx/sites-available/cleanmeta /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```
3. Setup SSL (HTTPS):
   ```bash
   certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com
   ```

## Step 6: Verify
Visit `https://YOUR_DOMAIN.com/health` to confirm the server is running.
