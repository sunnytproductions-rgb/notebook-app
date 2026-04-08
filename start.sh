#!/bin/bash
cd "$(dirname "$0")"
npx concurrently "npx vite" "npx wait-on http://localhost:5173 && npx electron ."
