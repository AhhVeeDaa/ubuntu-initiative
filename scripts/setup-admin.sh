#!/bin/bash

# Create Admin User - Setup Script
# This script helps you create your first admin user

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Ubuntu Initiative - Admin Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This will create an admin user with these credentials:"
echo "  📧 Email:    ahhveedaa@ubuntu-initiative.org"
echo "  👤 Username: ahhveedaa"
echo "  🔑 Password: Kinshasa123"
echo "  👑 Role:     super_admin"
echo ""

# Check if SUPABASE_SERVICE_ROLE_KEY is set
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "⚠️  SUPABASE_SERVICE_ROLE_KEY not found!"
    echo ""
    echo "📝 To get your service role key:"
    echo "1. Go to: https://supabase.com/dashboard/project/frforinozbawkikgiywe/settings/api"
    echo "2. Find the 'service_role' key (under 'Project API keys')"
    echo "3. Copy it"
    echo ""
    echo -n "Paste your service_role key here: "
    read -s SERVICE_KEY
    echo ""
    export SUPABASE_SERVICE_ROLE_KEY="$SERVICE_KEY"
fi

echo ""
echo "🚀 Creating admin user..."
echo ""

# Run the Node.js script
node scripts/create-admin-user.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Admin user created successfully!"
    echo ""
    echo "Next steps:"
    echo "  1. Start your web app: cd apps/web && npm run dev"
    echo "  2. Visit: http://localhost:3000"
    echo "  3. Click 'Sign In' and use the credentials above"
    echo ""
else
    echo ""
    echo "❌ Failed to create admin user"
    echo "Please check the error messages above"
    echo ""
fi
