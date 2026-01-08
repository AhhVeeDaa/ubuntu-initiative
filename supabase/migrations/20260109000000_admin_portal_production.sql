-- ============================================================================
-- ADMIN PORTAL SCHEMA - PRODUCTION READY
-- Implementation of Role-Based Access Control (RBAC) and Activity Logging
-- ============================================================================

-- 1) Remove existing constraints and prepare for new schema
DO $$ BEGIN
  -- Remove old unique constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.conname = 'unique_active_admin_role' AND n.nspname = 'public'
  ) THEN
    ALTER TABLE public.admin_roles DROP CONSTRAINT unique_active_admin_role;
  END IF;
END $$;

-- 2) Create Admin Roles Table
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
    CONSTRAINT ck_admin_roles_user_id_not_null CHECK (user_id IS NOT NULL)
);

-- 3) Create Admin Activity Log Table
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

-- 4) Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON public.admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_roles_role ON public.admin_roles(role);
CREATE INDEX IF NOT EXISTS idx_admin_roles_expires_at ON public.admin_roles(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_user_id ON public.admin_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON public.admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_action ON public.admin_activity_log(action);

-- 5) Create Partial Unique Index - Only one active role per user at a time
CREATE UNIQUE INDEX IF NOT EXISTS ux_admin_roles_active_user
  ON public.admin_roles(user_id)
  WHERE is_active = true AND (expires_at IS NULL OR expires_at > NOW());

-- 6) Create Trigger Function for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 7) Attach Trigger to admin_roles
DROP TRIGGER IF EXISTS trg_admin_roles_set_updated_at ON public.admin_roles;
CREATE TRIGGER trg_admin_roles_set_updated_at
  BEFORE UPDATE ON public.admin_roles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 8) Enable Row Level Security
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- 9) Create Security Functions (STABLE, SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql 
STABLE 
SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = auth.uid()
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql 
STABLE 
SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$;
-- 10) Revoke Public Access to Security Functions
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM authenticated;

-- 11) Create RLS Policies for admin_roles

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Super admins can manage roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins manage roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can view roles" ON public.admin_roles;

-- Super admins have full control
CREATE POLICY "Super admins manage roles" ON public.admin_roles
  FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- All admins can view roles
CREATE POLICY "Admins can view roles" ON public.admin_roles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 12) Create RLS Policies for admin_activity_log

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.admin_activity_log;
DROP POLICY IF EXISTS "Admins can insert own logs" ON public.admin_activity_log;
DROP POLICY IF EXISTS "Admins can insert logs" ON public.admin_activity_log;
DROP POLICY IF EXISTS "No update delete admin_activity_log auth" ON public.admin_activity_log;
DROP POLICY IF EXISTS "No update admin_activity_log auth" ON public.admin_activity_log;
DROP POLICY IF EXISTS "No delete admin_activity_log auth" ON public.admin_activity_log;

-- Admins can view logs
CREATE POLICY "Admins can view activity logs" ON public.admin_activity_log
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Users can insert their own logs, admins can insert any logs
CREATE POLICY "Admins can insert logs" ON public.admin_activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id OR public.is_admin()
  );

-- Activity log is append-only: no updates
CREATE POLICY "No update admin_activity_log auth" ON public.admin_activity_log
  FOR UPDATE
  TO authenticated
  USING (false);

-- Activity log is append-only: no deletes
CREATE POLICY "No delete admin_activity_log auth" ON public.admin_activity_log
  FOR DELETE
  TO authenticated
  USING (false);

-- 13) Bootstrap Admin User (Idempotent)
-- Deactivate any existing active roles, then insert/update super_admin role
WITH deactivated AS (
  UPDATE public.admin_roles
  SET is_active = false, updated_at = NOW()
  WHERE user_id = '1dd2728c-618e-41bb-bc28-1d74e40eebb7' 
    AND is_active = true
  RETURNING *
)
INSERT INTO public.admin_roles (user_id, role, granted_by, notes, is_active)
VALUES (
  '1dd2728c-618e-41bb-bc28-1d74e40eebb7', 
  'super_admin', 
  '1dd2728c-618e-41bb-bc28-1d74e40eebb7', 
  'Initial Bootstrap - Production Schema', 
  true
)
ON CONFLICT (user_id) DO UPDATE
  SET 
    role = EXCLUDED.role, 
    is_active = EXCLUDED.is_active, 
    updated_at = NOW(),
    notes = EXCLUDED.notes;

-- 14) Add Comments for Documentation
COMMENT ON TABLE public.admin_roles IS 'Role-based access control for admin users. Enforces one active role per user via partial unique index.';
COMMENT ON TABLE public.admin_activity_log IS 'Append-only audit trail for all administrative actions. Updates and deletes are blocked via RLS.';
COMMENT ON FUNCTION public.is_admin() IS 'Security helper function. Returns true if current user has an active admin role.';
COMMENT ON FUNCTION public.is_super_admin() IS 'Security helper function. Returns true if current user has active super_admin role.';
COMMENT ON COLUMN public.admin_roles.expires_at IS 'Optional expiration timestamp for temporary admin access. NULL means no expiration.';
COMMENT ON COLUMN public.admin_roles.is_active IS 'Indicates if this role assignment is currently active. Only one active role allowed per user.';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
