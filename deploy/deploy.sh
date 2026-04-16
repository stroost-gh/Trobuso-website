#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Deployment script voor Trobuso-website
# Draai dit script na elke git pull vanuit /var/www/trobuso
# =============================================================================
set -euo pipefail

# --- Kleuren voor output ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[DEPLOY]${NC} $*"; }
warn() { echo -e "${YELLOW}[WAARSCHUWING]${NC} $*"; }
err()  { echo -e "${RED}[FOUT]${NC} $*" >&2; exit 1; }

# --- Configuratie ---
APP_DIR="/var/www/trobuso"
APP_NAME="trobuso-website"
DB_PATH="${APP_DIR}/prisma/dev.db"

# --- Ga naar projectmap ---
cd "${APP_DIR}" || err "Kan niet naar ${APP_DIR} navigeren."
log "Deployment gestart in ${APP_DIR}"

# --- Logmap aanmaken voor PM2 ---
mkdir -p "${APP_DIR}/logs"

# -------------------------------------------------------
# 1. Controleer of .env.local bestaat
# -------------------------------------------------------
if [[ ! -f "${APP_DIR}/.env.local" ]]; then
  err ".env.local niet gevonden! Draai eerst setup-vps.sh of maak het bestand handmatig aan."
fi

# -------------------------------------------------------
# 2. Dependencies installeren
# -------------------------------------------------------
log "Dependencies installeren (npm install)..."
npm ci --prefer-offline 2>/dev/null || npm install
log "Dependencies geinstalleerd."

# -------------------------------------------------------
# 3. Database setup (alleen bij eerste deployment)
# -------------------------------------------------------
if [[ ! -f "${DB_PATH}" ]]; then
  log "Geen database gevonden — eerste deployment, database aanmaken en seeden..."
  npm run setup
  log "Database aangemaakt en geseed."
else
  log "Database bestaat al — alleen schema bijwerken (zonder dataverlies)..."
  npx prisma db push
  log "Database-schema bijgewerkt."
fi

# -------------------------------------------------------
# 4. Prisma Client genereren
# -------------------------------------------------------
log "Prisma Client genereren..."
npx prisma generate
log "Prisma Client gegenereerd."

# -------------------------------------------------------
# 5. Next.js productie-build maken
# -------------------------------------------------------
log "Next.js productie-build starten..."
npm run build
log "Build voltooid."

# -------------------------------------------------------
# 6. PM2 proces herstarten of starten
# -------------------------------------------------------
if pm2 describe "${APP_NAME}" &>/dev/null; then
  log "PM2 proces '${APP_NAME}' herstarten..."
  pm2 restart "${APP_NAME}" --update-env
else
  log "PM2 proces '${APP_NAME}' voor het eerst starten..."
  pm2 start ecosystem.config.js
fi

# PM2 proceslijst opslaan zodat het na reboot terugkomt
pm2 save

log "=== Deployment voltooid! ==="
echo ""
echo "Status controleren:"
echo "  pm2 status"
echo "  pm2 logs ${APP_NAME}"
echo "  curl -I http://localhost:3000"
echo ""
