# ✅ COMPLETE THE SETUP - ONE FINAL STEP

## 🎉 Good News!

Your user account was **created successfully**!

- 📧 Email: `ahhveedaa@ubuntu-initiative.org`
- 👤 Username: `ahhveedaa`
- 🔑 Password: `Kinshasa123`
- 🆔 User ID: `1dd2728c-618e-41bb-bc28-1d74e40eebb7`

## ⚡ Quick Fix (2 minutes)

We just need to create the `admin_roles` table and assign your super_admin role.

### **Copy and Run This SQL:**

1. **Open Supabase SQL Editor:**
   👉 https://supabase.com/dashboard/project/frforinozbawkikgiywe/sql/new

2. **Copy this entire SQL block and click "RUN":**

```sql
-- ============================================================================
-- ADMIN PORTAL SCHEMA
-- ============================================================================

-- 1. Admin Roles Table
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

-- 2. Admin Activity Log Table
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

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON public.admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_roles_role ON public.admin_roles(role);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_user_id ON public.admin_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON public.admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_action ON public.admin_activity_log(action);

-- 4. Row Level Security
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
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

-- Helper function to check if user is super_admin
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

-- Policies
CREATE POLICY "Super admins can manage roles"
    ON public.admin_roles FOR ALL
    USING (public.is_super_admin());

CREATE POLICY "Admins can view roles"
    ON public.admin_roles FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can view activity logs"
    ON public.admin_activity_log FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can insert own logs"
    ON public.admin_activity_log FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 5. Assign YOUR super_admin role
INSERT INTO public.admin_roles (user_id, role, granted_by, notes)
VALUES (
    '1dd2728c-618e-41bb-bc28-1d74e40eebb7',
    'super_admin',
    '1dd2728c-618e-41bb-bc28-1d74e40eebb7',
    'Initial Bootstrap'
)
ON CONFLICT (user_id) DO UPDATE
SET role = 'super_admin',
    is_active = true,
    updated_at = NOW();
```

3. **That's it!** ✅

---

## 🚀 Now Login

```bash
cd apps/web
npm run dev
```

Then go to: **http://localhost:3000**

**Login with:**
- 📧 Email: `ahhveedaa@ubuntu-initiative.org`
- 🔑 Password: `Kinshasa123`

---

## ✨ You're Done!

You now have:
- ✅ User account created
- ✅ Admin portal schema installed
- ✅ Super admin role assigned
- ✅ Full platform access

**Welcome to the Ubuntu Initiative! 🎉**
