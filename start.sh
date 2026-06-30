#!/usr/bin/env bash
# SPLAY launcher for macOS / Linux.
# Double-click (or run ./start.sh) to install deps on first run and start the app.
set -e

cd "$(dirname "$0")"

echo "=================================================="
echo "   SPLAY - Skylight Placement Visualizer"
echo "=================================================="
echo

if ! command -v node >/dev/null 2>&1; then
  echo "[PROBLEM] Node.js is not installed."
  echo "  Install the LTS version from https://nodejs.org and run this again."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "First-time setup: installing the parts the app needs (once only)..."
  echo
  npm install
fi

echo
echo "Starting SPLAY... a browser window will open shortly."
echo ">> To STOP the app: press Ctrl+C in this window."
echo

npm run dev -- --open
