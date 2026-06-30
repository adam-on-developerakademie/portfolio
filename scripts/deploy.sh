#!/usr/bin/env bash

set -Eeuo pipefail

# Deploy script for Angular portfolio.
# Source repository and build are kept separate from the live web root.

REPO_DIR="${REPO_DIR:-/srv/www/portfolio}"
LIVE_DIR="${LIVE_DIR:-/var/www/portfolio}"
BRANCH="${BRANCH:-main}"
BACKEND_SERVICE="${BACKEND_SERVICE:-}"

if [[ "${EUID}" -eq 0 ]]; then
  echo "Do not run as root. Use a deploy user with sudo permissions if needed." >&2
  exit 1
fi

for cmd in git npm rsync; do
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    echo "Missing required command: ${cmd}" >&2
    exit 1
  fi
done

if [[ ! -d "${REPO_DIR}/.git" ]]; then
  echo "Repository not found at ${REPO_DIR}" >&2
  exit 1
fi

echo "[1/6] Updating repository"
cd "${REPO_DIR}"
git fetch --all --prune
git reset --hard "origin/${BRANCH}"
git clean -fd

echo "[2/6] Installing dependencies"
npm ci

echo "[3/6] Building Angular app"
npm run build

DIST_DIR="${REPO_DIR}/dist/portfolio/browser"
if [[ ! -d "${DIST_DIR}" ]]; then
  echo "Build output not found at ${DIST_DIR}" >&2
  exit 1
fi

echo "[4/6] Ensuring live directory exists"
sudo mkdir -p "${LIVE_DIR}"

echo "[5/6] Syncing build to live directory"
sudo rsync -av --delete "${DIST_DIR}/" "${LIVE_DIR}/"

if [[ -n "${BACKEND_SERVICE}" ]]; then
  echo "[6/6] Restarting backend service ${BACKEND_SERVICE}"
  sudo systemctl restart "${BACKEND_SERVICE}"
else
  echo "[6/6] Backend service restart skipped"
fi

echo "Deploy finished successfully."
