#!/bin/bash
# Run this script on your Ubuntu server as root or with sudo
# Usage: sudo bash setup.sh

set -e

APP_DIR="/var/www/brajnidhi"
SERVICE_NAME="brajnidhi"

echo "==> Copying environment file..."
cp brajnidhi.env /etc/$SERVICE_NAME.env
chmod 600 /etc/$SERVICE_NAME.env
chown root:root /etc/$SERVICE_NAME.env

echo "==> Copying service file..."
cp brajnidhi.service /etc/systemd/system/$SERVICE_NAME.service

echo "==> Reloading systemd..."
systemctl daemon-reload

echo "==> Enabling service to start on boot..."
systemctl enable $SERVICE_NAME

echo "==> Starting service..."
systemctl start $SERVICE_NAME

echo ""
echo "Done. Check status with:"
echo "  sudo systemctl status $SERVICE_NAME"
echo "  sudo journalctl -u $SERVICE_NAME -f"
