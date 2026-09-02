#!/usr/bin/env bash
#
# setup.sh — clona el sitio web de Music MP3 Downloader y arranca el servidor
# de desarrollo. Pensado para ejecutarse en local o de forma remota:
#
#   curl -fsSL https://raw.githubusercontent.com/ArcGabicho/music-mp3-downloader-page/main/setup.sh | bash
#
set -euo pipefail

REPO_URL="https://github.com/ArcGabicho/music-mp3-downloader-page.git"
DIR="music-mp3-downloader-page"
MIN_NODE_MAJOR=22
MIN_NODE_MINOR=12

info()  { printf '\033[1;34m==>\033[0m %s\n' "$1"; }
error() { printf '\033[1;31mError:\033[0m %s\n' "$1" >&2; exit 1; }

# --- Requisitos --------------------------------------------------------------
command -v git  >/dev/null 2>&1 || error "git no está instalado."
command -v node >/dev/null 2>&1 || error "Node.js no está instalado. Necesitas >= ${MIN_NODE_MAJOR}.${MIN_NODE_MINOR}.0"
command -v npm  >/dev/null 2>&1 || error "npm no está instalado."

NODE_VERSION="$(node -p 'process.versions.node')"
NODE_MAJOR="${NODE_VERSION%%.*}"
NODE_REST="${NODE_VERSION#*.}"
NODE_MINOR="${NODE_REST%%.*}"
if [ "$NODE_MAJOR" -lt "$MIN_NODE_MAJOR" ] ||
   { [ "$NODE_MAJOR" -eq "$MIN_NODE_MAJOR" ] && [ "$NODE_MINOR" -lt "$MIN_NODE_MINOR" ]; }; then
  error "Node.js ${NODE_VERSION} es demasiado antiguo. Necesitas >= ${MIN_NODE_MAJOR}.${MIN_NODE_MINOR}.0"
fi

# --- Clonado ---------------------------------------------------------------
if [ -d "$DIR/.git" ]; then
  info "El repositorio ya existe en ./${DIR}, actualizando…"
  git -C "$DIR" pull --ff-only
else
  [ -e "$DIR" ] && error "Ya existe ./${DIR} y no es un repositorio git. Muévelo o bórralo."
  info "Clonando ${REPO_URL}…"
  git clone "$REPO_URL" "$DIR"
fi

cd "$DIR"

# --- Dependencias y servidor de desarrollo -------------------------------------
info "Instalando dependencias (npm install)…"
npm install

info "Arrancando el servidor de desarrollo en http://localhost:4321 …"
exec npm run dev