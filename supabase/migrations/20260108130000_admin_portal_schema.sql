-- ============================================================================
-- ADMIN PORTAL SCHEMA
-- Implementation of Role-Based Access Control (RBAC) and Activity Logging
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

-- 4. Row Level Security (RLS)

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

-- Policies for admin_roles

-- Super admins can do everything
CREATE POLICY "Super admins can manage roles"
    ON public.admin_roles
    FOR ALL
    USING (public.is_super_admin());

-- All admins can view roles
CREATE POLICY "Admins can view roles"
    ON public.admin_roles
    FOR SELECT
    USING (public.is_admin());

-- Policies for admin_activity_log

-- Admins can view logs
CREATE POLICY "Admins can view activity logs"
    ON public.admin_activity_log
    FOR SELECT
    USING (public.is_admin());

-- Logs are inserted via application logic (service role) usually, 
-- but allow admins to insert their own logs if needed via client
CREATE POLICY "Admins can insert own logs"
    ON public.admin_activity_log
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 5. Comments
COMMENT ON TABLE public.admin_roles IS 'Stores role assignments for the Admin Portal';
COMMENT ON TABLE public.admin_activity_log IS 'Audit trail for all administrative actions';
