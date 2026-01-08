# 🔐 Admin User Setup Guide

This guide will help you create your first admin user for the Ubuntu Initiative platform.

## Quick Start

Run the setup script:

```bash
cd /Users/ahhveedaa/ubuntu-initiative
./scripts/setup-admin.sh
```

The script will prompt you for your Supabase service role key if needed.

## What Gets Created

**User Account:**
- 📧 Email: `ahhveedaa@ubuntu-initiative.org`
- 👤 Username: `ahhveedaa`
- 🔑 Password: `Kinshasa123`
- 👑 Role: `super_admin`

## Manual Setup (Alternative Method)

If you prefer to do this manually:

### Step 1: Get Your Service Role Key

1. Go to [Supabase Dashboard - API Settings](https://supabase.com/dashboard/project/frforinozbawkikgiywe/settings/api)
2. Find the **"service_role"** key under "Project API keys"
3. Copy it

### Step 2: Set Environment Variable

```bash
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

### Step 3: Run the Script

```bash
node scripts/create-admin-user.js
```

## Troubleshooting

### "SUPABASE_SERVICE_ROLE_KEY not found"

Make sure you've set the environment variable:
```bash
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5c...."
```

### "User already exists"

The script will automatically find the existing user and assign the admin role. No action needed!

### "Cannot find module '@supabase/supabase-js'"

Install dependencies first:
```bash
npm install
```

## After Setup

Once the admin user is created:

1. **Start the web app:**
   ```bash
   cd apps/web
   npm run dev
   ```

2. **Visit:** http://localhost:3000

3. **Sign in** with:
   - Email: `ahhveedaa@ubuntu-initiative.org`
   - Password: `Kinshasa123`

4. **Access admin features** - You now have full super_admin privileges!

## Admin Roles Explained

Your account has the **super_admin** role, which grants:

✅ Full access to admin portal
✅ Manage all users and roles  
✅ View all analytics and reports
✅ Configure system settings
✅ Access audit logs
✅ Approve/reject policy changes
✅ Manage agent runs
✅ View financial data

## Security Notes

🔒 **Change the default password** after first login
🔒 **Keep your service role key secure** - never commit it to Git
🔒 **Use environment variables** for sensitive data

## Database Schema

The script creates/updates these tables:

- `auth.users` - User account
- `public.admin_roles` - Role assignment

Example query to verify:
```sql
SELECT 
  u.email, 
  u.id as user_id,
  ar.role,
  ar.is_active
FROM auth.users u
LEFT JOIN public.admin_roles ar ON ar.user_id = u.id
WHERE u.email = 'ahhveedaa@ubuntu-initiative.org';
```

---

Need help? Check the main README or contact the development team.
