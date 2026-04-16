#!/usr/bin/env bash
# =============================================================================
# setup-vps.sh — Eenmalige server-setup voor Trobuso-website op TransIP VPS
# Domein: trobuso.nl
# OS: Ubuntu 22.04 / 24.04 LTS
# =============================================================================
set -euo pipefail

# --- Kleuren voor output ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[SETUP]${NC} $*"; }
warn() { echo -e "${YELLOW}[WAARSCHUWING]${NC} $*"; }
err()  { echo -e "${RED}[FOUT]${NC} $*" >&2; }

# --- Controleer of script als root draait ---
if [[ $EUID -ne 0 ]]; then
  err "Dit script moet als root worden uitgevoerd (sudo)."
  exit 1
fi

DOMAIN="trobuso.nl"
APP_DIR="/var/www/trobuso"
DEPLOY_USER="deploy"
NODE_MAJOR=20

log "=== VPS-setup gestart voor ${DOMAIN} ==="

# -------------------------------------------------------
# 1. Systeem bijwerken
# -------------------------------------------------------
log "Systeem-pakketten bijwerken..."
apt-get update -y
apt-get upgrade -y

# -------------------------------------------------------
# 2. Benodigde basispakketten installeren
# -------------------------------------------------------
log "Basispakketten installeren..."
apt-get install -y curl wget gnupg2 ca-certificates lsb-release \
  software-properties-common git ufw build-essential sqlite3

# -------------------------------------------------------
# 3. Node.js 20 LTS installeren via NodeSource
# -------------------------------------------------------
if command -v node &>/dev/null && node -v | grep -q "v${NODE_MAJOR}"; then
  log "Node.js $(node -v) is al geinstalleerd."
else
  log "Node.js ${NODE_MAJOR} LTS installeren via NodeSource..."
  curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash -
  apt-get install -y nodejs
  log "Node.js $(node -v) en npm $(npm -v) geinstalleerd."
fi

# -------------------------------------------------------
# 4. PM2 globaal installeren
# -------------------------------------------------------
if command -v pm2 &>/dev/null; then
  log "PM2 is al geinstalleerd."
else
  log "PM2 globaal installeren..."
  npm install -g pm2
  log "PM2 $(pm2 -v) geinstalleerd."
fi

# -------------------------------------------------------
# 5. Nginx installeren
# -------------------------------------------------------
if command -v nginx &>/dev/null; then
  log "Nginx is al geinstalleerd."
else
  log "Nginx installeren..."
  apt-get install -y nginx
fi

# -------------------------------------------------------
# 6. Certbot installeren voor SSL (Let's Encrypt)
# -------------------------------------------------------
if command -v certbot &>/dev/null; then
  log "Certbot is al geinstalleerd."
else
  log "Certbot installeren..."
  apt-get install -y certbot python3-certbot-nginx
fi

# -------------------------------------------------------
# 7. Deploy-gebruiker aanmaken (indien nodig)
# -------------------------------------------------------
if id "${DEPLOY_USER}" &>/dev/null; then
  log "Gebruiker '${DEPLOY_USER}' bestaat al."
else
  log "Gebruiker '${DEPLOY_USER}' aanmaken..."
  adduser --disabled-password --gecos "Deploy User" "${DEPLOY_USER}"
  usermod -aG sudo "${DEPLOY_USER}"
  log "Gebruiker '${DEPLOY_USER}' aangemaakt en toegevoegd aan sudo-groep."
fi

# -------------------------------------------------------
# 8. Projectmap aanmaken en rechten instellen
# -------------------------------------------------------
log "Projectmap ${APP_DIR} aanmaken..."
mkdir -p "${APP_DIR}"
chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${APP_DIR}"

# -------------------------------------------------------
# 9. Firewall configureren (UFW)
# -------------------------------------------------------
log "Firewall (UFW) configureren..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
log "Firewall ingeschakeld: SSH en Nginx (HTTP+HTTPS) toegestaan."

# -------------------------------------------------------
# 10. Nginx-configuratie kopieren
# -------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_CONF="${SCRIPT_DIR}/nginx.conf"

if [[ -f "${NGINX_CONF}" ]]; then
  log "Nginx-configuratie kopieren naar /etc/nginx/sites-available/${DOMAIN}..."
  cp "${NGINX_CONF}" "/etc/nginx/sites-available/${DOMAIN}"
  ln -sf "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/${DOMAIN}"

  # Verwijder default config als die er nog is
  rm -f /etc/nginx/sites-enabled/default

  # Test Nginx configuratie
  nginx -t && systemctl reload nginx
  log "Nginx-configuratie actief."
else
  warn "nginx.conf niet gevonden in ${SCRIPT_DIR}. Kopieer handmatig."
fi

# -------------------------------------------------------
# 11. PM2 startup configureren
# -------------------------------------------------------
log "PM2 startup instellen voor gebruiker '${DEPLOY_USER}'..."
env PATH="$PATH:/usr/bin" pm2 startup systemd -u "${DEPLOY_USER}" --hp "/home/${DEPLOY_USER}"

# -------------------------------------------------------
# 12. .env.local template aanmaken
# -------------------------------------------------------
ENV_FILE="${APP_DIR}/.env.local"
if [[ ! -f "${ENV_FILE}" ]]; then
  log ".env.local aanmaken met productie-template..."
  cat > "${ENV_FILE}" <<'ENVEOF'
# =============================================================================
# Productie-omgevingsvariabelen voor Trobuso-website
# =============================================================================

# Auth — NEXTAUTH_URL moet het live domein zijn
NEXTAUTH_URL="https://trobuso.nl"
NEXTAUTH_SECRET="WIJZIG_DIT__genereer_met__openssl_rand_base64_32"

# Admin account (wordt aangemaakt bij eerste seed)
ADMIN_EMAIL="admin@trobuso.nl"
ADMIN_PASSWORD="WIJZIG_DIT_WACHTWOORD"
ENVEOF
  chown "${DEPLOY_USER}:${DEPLOY_USER}" "${ENV_FILE}"
  chmod 600 "${ENV_FILE}"
  warn "Vergeet niet de waarden in ${ENV_FILE} aan te passen!"
  warn "Genereer een secret met: openssl rand -base64 32"
else
  log ".env.local bestaat al, wordt niet overschreven."
fi

# -------------------------------------------------------
# 13. SQLite database-map voorbereiden
# -------------------------------------------------------
DB_DIR="${APP_DIR}/prisma"
mkdir -p "${DB_DIR}"
chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${DB_DIR}"
log "Database-map ${DB_DIR} aangemaakt."

# -------------------------------------------------------
# Klaar
# -------------------------------------------------------
echo ""
log "=== VPS-setup voltooid! ==="
echo ""
echo "Volgende stappen:"
echo "  1. Pas ${ENV_FILE} aan met productie-waarden"
echo "  2. Clone of kopieer de code naar ${APP_DIR}"
echo "  3. Draai als '${DEPLOY_USER}': cd ${APP_DIR} && bash deploy/deploy.sh"
echo "  4. SSL instellen: sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo ""
