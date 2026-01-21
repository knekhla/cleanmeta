#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Starting CleanMeta Server Provisioning...${NC}"

# 1. Update System
echo -e "${GREEN}Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20.x
echo -e "${GREEN}Installing Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install Redis
echo -e "${GREEN}Installing Redis...${NC}"
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# 4. Install Exiftool (Perl version is usually standard, but ensuring libs)
echo -e "${GREEN}Installing Exiftool Dependencies...${NC}"
sudo apt install -y libimage-exiftool-perl

# 5. Install Nginx & Certbot
echo -e "${GREEN}Installing Nginx & Certbot...${NC}"
sudo apt install -y nginx certbot python3-certbot-nginx

# 6. Install PM2
echo -e "${GREEN}Installing PM2...${NC}"
sudo npm install -g pm2

# 7. Setup Directory
echo -e "${GREEN}Creating app directory...${NC}"
sudo mkdir -p /var/www/cleanmeta
sudo chown -R $USER:$USER /var/www/cleanmeta

echo -e "${GREEN}Provisioning Complete!${NC}"
echo "Next steps:"
echo "1. Clone/Upload your code to /var/www/cleanmeta"
echo "2. Run 'npm install' and 'npm run build'"
echo "3. Configure .env"
echo "4. Start with 'pm2 start dist/server.js --name cleanmeta'"
