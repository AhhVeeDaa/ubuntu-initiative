#!/bin/bash

# Apply Production Admin Schema Migration
# This script applies the hardened admin portal schema to your Supabase database

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Admin Portal - Production Schema"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This will apply the following changes:"
echo "  ✅ Create admin_roles table"
echo "  ✅ Create admin_activity_log table"
echo "  ✅ Set up RLS policies"
echo "  ✅ Create security functions"
echo "  ✅ Bootstrap super_admin role"
echo ""

# Check if service key is set
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "⚠️  SUPABASE_SERVICE_ROLE_KEY not found"
    echo ""
    echo "You have two options:"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 OPTION 1: Manual (Recommended)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Open: https://supabase.com/dashboard/project/frforinozbawkikgiywe/sql/new"
    echo "2. Copy the SQL from:"
    echo "   supabase/migrations/20260109000000_admin_portal_production.sql"
    echo "3. Paste and click 'RUN'"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 OPTION 2: Automatic"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Set your service key and re-run:"
    echo "  export SUPABASE_SERVICE_ROLE_KEY='your-key-here'"
    echo "  ./scripts/apply-admin-schema.sh"
    echo ""
    exit 1
fi

echo "✅ Service key found"
echo ""
echo "📄 Reading migration file..."

MIGRATION_FILE="supabase/migrations/20260109000000_admin_portal_production.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

echo "✅ Migration file found"
echo ""
echo "⚠️  WARNING: This will modify your production database"
echo ""
read -p "Continue? (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "🚀 Applying migration..."
echo ""

# For local Supabase
if [ "$1" = "--local" ]; then
    npx supabase migration up
    exit_code=$?
else
    # For remote, we'd need the Supabase CLI to be linked
    echo "❌ Automatic remote migration not yet supported"
    echo ""
    echo "Please use OPTION 1 (Manual) above."
    echo "Copy the SQL from: $MIGRATION_FILE"
    echo ""
    exit 1
fi

if [ $exit_code -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ MIGRATION SUCCESSFUL"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🎉 Admin portal schema is now active!"
    echo ""
    echo "Your super_admin account:"
    echo "  📧 ahhveedaa@ubuntu-initiative.org"
    echo "  🔑 Kinshasa123"
    echo ""
    echo "Next steps:"
    echo "  1. Start web app: ./scripts/start-web.sh"
    echo "  2. Login at: http://localhost:3000"
    echo "  3. Access admin features"
    echo ""
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ MIGRATION FAILED"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Please check the errors above."
    echo "You may need to run the SQL manually."
    echo ""
fi
