#!/bin/bash
# Quick helper to open Vercel environment variable settings

echo "🔐 Opening Vercel Environment Variable Settings..."
echo ""

# Project 1: Web App
echo "📱 Project 1: ubuntu-initiative-web"
echo "Opening in browser..."
open "https://vercel.com/avida-s-projects/ubuntu-initiative-web/settings/environment-variables"

sleep 2

# Project 2: Dashboard
echo ""
echo "📊 Project 2: ubuntu-initiative-dashboard"
echo "Opening in browser..."
open "https://vercel.com/avida-s-projects/ubuntu-initiative-dashboard/settings/environment-variables"

echo ""
echo "✅ Both Vercel settings pages opened!"
echo ""
echo "📋 Variables to add:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 BOTH PROJECTS (Web + Dashboard):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. NEXT_PUBLIC_SUPABASE_URL"
echo "   https://fohifgmbuewmjybdtidk.supabase.co"
echo ""
echo "2. SUPABASE_SERVICE_ROLE_KEY"
echo "   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaGlmZ21idWV3bWp5YmR0aWRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzI5MjY5NCwiZXhwIjoyMDgyODY4Njk0fQ.vAlNLR5gRPdhSZckz8dU4UapYslFAmCrk8UauQBE-L0"
echo ""
echo "3. GOOGLE_AI_API_KEY"
echo "   AIzaSyA_bAP956JwrF1pvDmRVNednigilCTuT44"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 WEB APP ONLY (ubuntu-initiative-web):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "4. CRON_SECRET"
echo "   rRqnAQxuCEviyBmjEy+UKrWzL2li+P8yIFuLJoo9eU8="
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Pro Tips:"
echo "  - Copy values exactly (no extra spaces!)"
echo "  - Check all 3 environments: Production, Preview, Development"
echo "  - Click 'Save' after each variable"
echo "  - Redeploy both apps after adding variables"
echo ""
echo "📚 Full guide: See artifact 'Vercel Environment Variables Setup Guide'"
echo ""
