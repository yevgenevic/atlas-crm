#!/usr/bin/env bash
# Atlas Apparel CRM — pull latest, rebuild, restart.
# Unit 6 criterion: C.P6 (repeatable deployment) — run on the EC2 instance.
#
# Usage:  bash deploy/deploy.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/home/ubuntu/atlas-crm}"
BRANCH="${BRANCH:-main}"

cd "$APP_DIR"

echo "==> Pulling latest ($BRANCH)..."
git pull origin "$BRANCH"

echo "==> Installing dependencies (npm ci)..."
npm ci

echo "==> Building production bundle..."
npm run build

echo "==> Restarting service..."
sudo systemctl restart atlas-crm

echo "==> Done. Service status:"
sudo systemctl --no-pager --lines=0 status atlas-crm || true
