
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types'; // Assuming types exist or will be generated

export type AdminRole = 'super_admin' | 'operations_admin' | 'finance_admin' | 'viewer';

export interface AdminPermission {
    action: 'create' | 'read' | 'update' | 'delete' | 'manage';
    resource: 'users' | 'finance' | 'operations' | 'settings' | 'logs';
}

const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
    super_admin: [
        { action: 'manage', resource: 'users' },
        { action: 'manage', resource: 'finance' },
        { action: 'manage', resource: 'operations' },
        { action: 'manage', resource: 'settings' },
        { action: 'manage', resource: 'logs' },
    ],
    operations_admin: [
        { action: 'read', resource: 'users' },
        { action: 'manage', resource: 'operations' },
        { action: 'read', resource: 'finance' },
        { action: 'read', resource: 'logs' },
    ],
    finance_admin: [
        { action: 'read', resource: 'users' },
        { action: 'read', resource: 'operations' },
        { action: 'manage', resource: 'finance' },
        { action: 'read', resource: 'logs' },
    ],
    viewer: [
        { action: 'read', resource: 'users' },
        { action: 'read', resource: 'operations' },
        { action: 'read', resource: 'finance' },
        { action: 'read', resource: 'settings' },
    ],
};

export async function checkPermission(
    role: AdminRole,
    permission: AdminPermission
): Promise<boolean> {
    const permissions = ROLE_PERMISSIONS[role];
    if (!permissions) return false;

    return permissions.some(
        (p) =>
            (p.action === 'manage' || p.action === permission.action) &&
            (p.resource === permission.resource)
    );
}

export async function getCurrentAdminRole(): Promise<AdminRole | null> {
    const supabase = createClientComponentClient<Database>();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: roleData } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

    return roleData?.role as AdminRole | null;
}
