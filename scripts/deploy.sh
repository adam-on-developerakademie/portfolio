#!/usr/bin/env bash

set -Eeuo pipefail

# Unified deploy script for portfolio + codder on one server.
# Everything is expected to live under /srv/www and /var/www after migration.

PORTFOLIO_REPO_DIR="${PORTFOLIO_REPO_DIR:-/srv/www/portfolio}"
PORTFOLIO_REPO_URL="${PORTFOLIO_REPO_URL:-https://github.com/adam-on-developerakademie/portfolio}"
PORTFOLIO_BRANCH="${PORTFOLIO_BRANCH:-main}"

CODERR_BACKEND_REPO_DIR="${CODERR_BACKEND_REPO_DIR:-/srv/www/coderr-backend}"
CODERR_BACKEND_REPO_URL="${CODERR_BACKEND_REPO_URL:-https://github.com/adam-on-developerakademie/Coderr}"
CODERR_BACKEND_BRANCH="${CODERR_BACKEND_BRANCH:-main}"

CODERR_FRONTEND_REPO_DIR="${CODERR_FRONTEND_REPO_DIR:-/srv/www/coderr-frontend-src}"
CODERR_FRONTEND_REPO_URL="${CODERR_FRONTEND_REPO_URL:-https://github.com/adam-on-developerakademie/project.Coderr}"
CODERR_FRONTEND_BRANCH="${CODERR_FRONTEND_BRANCH:-main}"

PORTFOLIO_LIVE_DIR="${PORTFOLIO_LIVE_DIR:-/var/www/portfolio}"
CODERR_FRONTEND_LIVE_DIR="${CODERR_FRONTEND_LIVE_DIR:-/var/www/coderr-frontend}"
CODERR_STATIC_LIVE_DIR="${CODERR_STATIC_LIVE_DIR:-/var/www/Coderr/staticfiles}"
CODERR_MEDIA_LIVE_DIR="${CODERR_MEDIA_LIVE_DIR:-/var/www/Coderr/media}"

PORTFOLIO_API_SERVICE="${PORTFOLIO_API_SERVICE:-portfolio-api}"
CODERR_BACKEND_SERVICE="${CODERR_BACKEND_SERVICE:-}"

if [[ "${EUID}" -eq 0 ]]; then
  echo "Do not run as root. Use a deploy user with sudo permissions if needed." >&2
  exit 1
fi

for cmd in git npm rsync python3; do
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    echo "Missing required command: ${cmd}" >&2
    exit 1
  fi
done

sync_repo() {
  local repo_dir="$1"
  local repo_url="$2"
  local branch="$3"
  if [[ -d "${repo_dir}/.git" ]]; then
    cd "${repo_dir}"
    git fetch --all --prune
    git reset --hard "origin/${branch}"
    git clean -fd
    return
  fi
  if [[ -z "${repo_url}" ]]; then
    echo "Repository missing at ${repo_dir} and no repo URL set." >&2
    exit 1
  fi
  mkdir -p "$(dirname "${repo_dir}")"
  git clone --branch "${branch}" "${repo_url}" "${repo_dir}"
}

echo "[1/9] Syncing portfolio repository"
sync_repo "${PORTFOLIO_REPO_DIR}" "${PORTFOLIO_REPO_URL}" "${PORTFOLIO_BRANCH}"

echo "[2/9] Building portfolio"
cd "${PORTFOLIO_REPO_DIR}"
npm ci
npm run build

PORTFOLIO_DIST_DIR="${PORTFOLIO_REPO_DIR}/dist/portfolio/browser"
if [[ ! -d "${PORTFOLIO_DIST_DIR}" ]]; then
  echo "Portfolio build output not found at ${PORTFOLIO_DIST_DIR}" >&2
  exit 1
fi

echo "[3/9] Publishing portfolio static files"
sudo mkdir -p "${PORTFOLIO_LIVE_DIR}"
sudo rsync -av --delete "${PORTFOLIO_DIST_DIR}/" "${PORTFOLIO_LIVE_DIR}/"

echo "[4/9] Syncing codder backend repository"
sync_repo "${CODERR_BACKEND_REPO_DIR}" "${CODERR_BACKEND_REPO_URL}" "${CODERR_BACKEND_BRANCH}"

echo "[5/9] Installing codder backend dependencies"
cd "${CODERR_BACKEND_REPO_DIR}"
if [[ -x "${CODERR_BACKEND_REPO_DIR}/.venv/bin/pip" ]]; then
  "${CODERR_BACKEND_REPO_DIR}/.venv/bin/pip" install -r requirements.txt
  DJANGO_PYTHON="${CODERR_BACKEND_REPO_DIR}/.venv/bin/python"
else
  python3 -m venv .venv
  "${CODERR_BACKEND_REPO_DIR}/.venv/bin/pip" install -r requirements.txt
  DJANGO_PYTHON="${CODERR_BACKEND_REPO_DIR}/.venv/bin/python"
fi

echo "[6/9] Running collectstatic for codder backend"
"${DJANGO_PYTHON}" manage.py collectstatic --noinput

echo "[7/9] Publishing codder static and media files"
sudo mkdir -p "${CODERR_STATIC_LIVE_DIR}" "${CODERR_MEDIA_LIVE_DIR}"
sudo rsync -av --delete "${CODERR_BACKEND_REPO_DIR}/staticfiles/" "${CODERR_STATIC_LIVE_DIR}/"
sudo rsync -av "${CODERR_BACKEND_REPO_DIR}/media/" "${CODERR_MEDIA_LIVE_DIR}/"

echo "[8/9] Syncing codder frontend repository"
sync_repo "${CODERR_FRONTEND_REPO_DIR}" "${CODERR_FRONTEND_REPO_URL}" "${CODERR_FRONTEND_BRANCH}"
sudo mkdir -p "${CODERR_FRONTEND_LIVE_DIR}"
sudo rsync -av --delete \
  --exclude '.git' \
  --exclude '.github' \
  --exclude 'README.md' \
  --exclude 'LICENSE.md' \
  --exclude 'CHANGELOG.md' \
  "${CODERR_FRONTEND_REPO_DIR}/" "${CODERR_FRONTEND_LIVE_DIR}/"

echo "[9/9] Restarting services"
if [[ -n "${CODERR_BACKEND_SERVICE}" ]]; then
  sudo systemctl restart "${CODERR_BACKEND_SERVICE}"
fi
sudo systemctl restart "${PORTFOLIO_API_SERVICE}"
sudo nginx -t
sudo systemctl reload nginx

echo "Deploy finished successfully."
echo "Portfolio repo: ${PORTFOLIO_REPO_DIR}"
echo "Codder backend repo: ${CODERR_BACKEND_REPO_DIR}"
echo "Codder frontend repo: ${CODERR_FRONTEND_REPO_DIR}"
