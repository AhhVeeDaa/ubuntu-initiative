/**
 * Admin Portal Types
 * TypeScript definitions for admin roles and activity logging
 */

// ============================================================================
// ENUMS
// ============================================================================

export const AdminRole = {
  SUPER_ADMIN: 'super_admin',
  OPERATIONS_ADMIN: 'operations_admin',
  FINANCE_ADMIN: 'finance_admin',
  VIEWER: 'viewer',
} as const;

export type AdminRoleType = typeof AdminRole[keyof typeof AdminRole];

export const ActivityStatus = {
  SUCCESS: 'success',
  FAILURE: 'failure',
} as const;

export type ActivityStatusType = typeof ActivityStatus[keyof typeof ActivityStatus];

// ============================================================================
// DATABASE TYPES
// ============================================================================

export interface AdminRoleRow {
  id: string;
  user_id: string;
  role: AdminRoleType;
  is_active: boolean;
  granted_by: string | null;
  granted_at: string;
  updated_at: string;
  expires_at: string | null;
  notes: string | null;
}

export interface AdminActivityLogRow {
  id: string;
  user_id: string | null;
  action: string;
  resource: string | null;
  status: ActivityStatusType;
  ip_address: string | null;
  details: Record<string, any> | null;
  user_agent: string | null;
  created_at: string;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateAdminRoleRequest {
  user_id: string;
  role: AdminRoleType;
  granted_by: string;
  notes?: string;
  expires_at?: string;
}

export interface UpdateAdminRoleRequest {
  role?: AdminRoleType;
  is_active?: boolean;
  expires_at?: string | null;
  notes?: string;
}

export interface LogActivityRequest {
  action: string;
  resource?: string;
  status?: ActivityStatusType;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

// ============================================================================
// VIEW TYPES (with joined user data)
// ============================================================================

export interface AdminRoleWithUser extends AdminRoleRow {
  user?: {
    id: string;
    email: string;
    user_metadata?: {
      username?: string;
      full_name?: string;
    };
  };
  granted_by_user?: {
    id: string;
    email: string;
    user_metadata?: {
      username?: string;
      full_name?: string;
    };
  };
}

export interface AdminActivityLogWithUser extends AdminActivityLogRow {
  user?: {
    id: string;
    email: string;
    user_metadata?: {
      username?: string;
      full_name?: string;
    };
  };
}

// ============================================================================
// PERMISSION HELPERS
// ============================================================================

export const AdminPermissions = {
  // Super Admin - Full system access
  SUPER_ADMIN: [
    'users:read',
    'users:write',
    'users:delete',
    'roles:read',
    'roles:write',
    'roles:delete',
    'activity:read',
    'system:configure',
    'agents:read',
    'agents:write',
    'agents:execute',
    'finance:read',
    'finance:write',
  ],
  
  // Operations Admin - Day-to-day operations
  OPERATIONS_ADMIN: [
    'users:read',
    'roles:read',
    'activity:read',
    'agents:read',
    'agents:write',
    'agents:execute',
  ],
  
  // Finance Admin - Financial data access
  FINANCE_ADMIN: [
    'users:read',
    'roles:read',
    'activity:read',
    'finance:read',
    'finance:write',
  ],
  
  // Viewer - Read-only access
  VIEWER: [
    'users:read',
    'roles:read',
    'activity:read',
  ],
} as const;

export function getPermissionsForRole(role: AdminRoleType): readonly string[] {
  switch (role) {
    case AdminRole.SUPER_ADMIN:
      return AdminPermissions.SUPER_ADMIN;
    case AdminRole.OPERATIONS_ADMIN:
      return AdminPermissions.OPERATIONS_ADMIN;
    case AdminRole.FINANCE_ADMIN:
      return AdminPermissions.FINANCE_ADMIN;
    case AdminRole.VIEWER:
      return AdminPermissions.VIEWER;
    default:
      return [];
  }
}

export function hasPermission(role: AdminRoleType, permission: string): boolean {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(permission);
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function isValidAdminRole(role: string): role is AdminRoleType {
  return Object.values(AdminRole).includes(role as AdminRoleType);
}

export function isValidActivityStatus(status: string): status is ActivityStatusType {
  return Object.values(ActivityStatus).includes(status as ActivityStatusType);
}

export function isActiveRole(adminRole: AdminRoleRow): boolean {
  if (!adminRole.is_active) return false;
  if (!adminRole.expires_at) return true;
  return new Date(adminRole.expires_at) > new Date();
}
