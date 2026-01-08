#!/bin/bash

# Quick Admin Creation Script
# This script attempts to use Supabase CLI to get the service role key automatically

echo "🔐 Ubuntu Initiative - Quick Admin Setup"
echo ""

# Check if user wants to use remote or local Supabase
echo "Which Supabase instance?"
echo "  1) Remote (frforinozbawkikgiywe.supabase.co)"  
echo "  2) Local (127.0.0.1:54321)"
echo ""
read -p "Enter choice [1-2]: " choice

if [ "$choice" = "2" ]; then
    # Local Supabase
    echo ""
    echo "📡 Using local Supabase instance..."
    
    # Start Supabase if not running
    npx supabase start 2>/dev/null
    
    # Get the service role key from local Supabase
    SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
    
    export SUPABASE_SERVICE_ROLE_KEY="$SERVICE_KEY"
    export NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
    
    echo "✅ Using local Supabase"
    echo ""
    
else
    # Remote Supabase
    echo ""
    echo "📡 Using remote Supabase instance..."
    
    # Check if service key is already set
    if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
        echo ""
        echo "ℹ️  Get your service role key from:"
        echo "   https://supabase.com/dashboard/project/frforinozbawkikgiywe/settings/api"
        echo ""
        echo -n "Paste your service_role key: "
        read -s SERVICE_KEY
        echo ""
        export SUPABASE_SERVICE_ROLE_KEY="$SERVICE_KEY"
    fi
    
    export NEXT_PUBLIC_SUPABASE_URL="https://frforinozbawkikgiywe.supabase.co"
fi

echo ""
echo "🚀 Creating admin user..."
echo "   Email:    ahhveedaa@ubuntu-initiative.org"
echo "   Username: ahhveedaa"
echo "   Password: Kinshasa123"
echo ""

# Run the creation script
node scripts/create-admin-user.js

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ SUCCESS!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Next steps:"
    if [ "$choice" = "2" ]; then
        echo "  1. Go to: http://127.0.0.1:54323"
        echo "  2. Or start web app: cd apps/web && npm run dev"
    else
        echo "  1. Start web app: cd apps/web && npm run dev"
        echo "  2. Visit: http://localhost:3000"
    fi
    echo "  3. Sign in with the credentials above"
    echo ""
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ FAILED"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Check the error messages above"
    echo ""
fi
