#!/bin/bash

# Start Web App - Handles common issues automatically

echo "🚀 Starting Ubuntu Initiative Web App..."
echo ""

# Navigate to web directory
cd "$(dirname "$0")/../apps/web" || exit 1

# Kill any existing process on port 3000
echo "🔍 Checking port 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is in use, clearing it..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 1
    echo "✅ Port 3000 cleared"
else
    echo "✅ Port 3000 is available"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Starting Next.js Development Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Local:   http://localhost:3000"
echo "📍 Network: http://192.168.0.102:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Unset NODE_ENV to avoid warnings and start server
unset NODE_ENV
npx next dev -p 3000
