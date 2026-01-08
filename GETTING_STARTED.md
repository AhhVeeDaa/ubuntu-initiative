# 🚀 Ubuntu Initiative - Getting Started

## ✅ Current Status

### What's Working:
- ✅ **User Account Created**
  - Email: `ahhveedaa@ubuntu-initiative.org`
  - Password: `Kinshasa123`
  - User ID: `1dd2728c-618e-41bb-bc28-1d74e40eebb7`

- ✅ **Web Server Running**
  - Local: http://localhost:3000
  - Network: http://192.168.0.102:3000

### What's Pending:
- ⚠️ **Admin Role Assignment** - Need to run SQL (see below)

---

## 🎯 Quick Start (3 Steps)

### Step 1: Assign Admin Role (One-Time Setup)

**Open Supabase SQL Editor:**
👉 https://supabase.com/dashboard/project/frforinozbawkikgiywe/sql/new

**Copy and paste this SQL, then click "RUN":**

```sql
-- Create Admin Tables and Assign Your Role
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'operations_admin', 'finance_admin', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    CONSTRAINT unique_active_admin_role UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.admin_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource TEXT,
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failure')),
    ip_address TEXT,
    details JSONB,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON public.admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_roles_role ON public.admin_roles(role);
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Super admins can manage roles"
    ON public.admin_roles FOR ALL
    USING (public.is_super_admin());

CREATE POLICY "Admins can view roles"
    ON public.admin_roles FOR SELECT
    USING (public.is_admin());

-- Assign YOUR super_admin role
INSERT INTO public.admin_roles (user_id, role, granted_by, notes)
VALUES (
    '1dd2728c-618e-41bb-bc28-1d74e40eebb7',
    'super_admin',
    '1dd2728c-618e-41bb-bc28-1d74e40eebb7',
    'Initial Bootstrap'
)
ON CONFLICT (user_id) DO UPDATE
SET role = 'super_admin', is_active = true, updated_at = NOW();
```

### Step 2: Start the Web App

**Option A: Using the helper script (recommended)**
```bash
cd /Users/ahhveedaa/ubuntu-initiative
./scripts/start-web.sh
```

**Option B: Using npm**
```bash
cd /Users/ahhveedaa/ubuntu-initiative/apps/web
npm run dev
```

### Step 3: Login

1. Open your browser: **http://localhost:3000**
2. Click "Sign In"
3. Enter:
   - Email: `ahhveedaa@ubuntu-initiative.org`
   - Password: `Kinshasa123`

---

## 🛠️ Troubleshooting

### "Port 3000 already in use"

**Quick fix:**
```bash
lsof -ti:3000 | xargs kill -9
```

Or use the helper script which handles this automatically:
```bash
./scripts/start-web.sh
```

### "NODE_ENV warning"

This is handled automatically by the updated dev script and helper script.

### "Table admin_roles does not exist"

Run the SQL from Step 1 above in your Supabase SQL Editor.

### "Cannot find module '@supabase/supabase-js'"

Install dependencies:
```bash
cd /Users/ahhveedaa/ubuntu-initiative
npm install
```

---

## 📁 Useful Scripts

```bash
# Start web app (handles port conflicts)
./scripts/start-web.sh

# Create admin user (if needed)
./scripts/quick-admin-setup.sh

# Fix admin role (if table exists but role not assigned)
./scripts/fix-admin-role.sh
```

---

## 🎯 What You Can Do After Login

As **super_admin**, you have full access to:

- ✅ **Admin Portal** - User management, system configuration
- ✅ **Dashboard** - Analytics and metrics
- ✅ **Agent Management** - Configure and monitor AI agents
- ✅ **Financial Data** - Track donations and spending
- ✅ **Audit Logs** - View all system activities
- ✅ **Policy Management** - Approve/reject policy changes

---

## 🔒 Security Recommendations

1. **Change your password** after first login:
   - Go to Profile Settings
   - Update to a strong, unique password

2. **Store sensitive keys** in `.env.local`:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your-key-here
   ```

3. **Never commit** `.env.local` to Git

4. **Enable 2FA** in Supabase Dashboard (recommended)

---

## 🌐 URLs

- **Web App (Local):** http://localhost:3000
- **Web App (Network):** http://192.168.0.102:3000
- **Dashboard:** https://ubuntu-initiative-dashboard.vercel.app
- **Supabase Dashboard:** https://supabase.com/dashboard/project/frforinozbawkikgiywe
- **Supabase SQL Editor:** https://supabase.com/dashboard/project/frforinozbawkikgiywe/sql/new

---

## 📞 Need Help?

Check these files:
- `FINAL_SETUP_STEP.md` - Complete setup instructions
- `ADMIN_SETUP_GUIDE.md` - Detailed admin setup guide
- `README.md` - Project overview

---

**You're all set! The server is running at http://localhost:3000 🚀**
