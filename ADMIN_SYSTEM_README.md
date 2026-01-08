# 🔐 Admin Portal System - Production Ready

## Overview

Complete Role-Based Access Control (RBAC) system with activity logging, designed for production use with hardened security.

## Features

✅ **Four Admin Roles**
- `super_admin` - Full system access
- `operations_admin` - Day-to-day operations
- `finance_admin` - Financial data access  
- `viewer` - Read-only access

✅ **Security Features**
- Row Level Security (RLS) enabled
- One active role per user enforcement
- Optional role expiration
- Append-only activity logs
- STABLE, SECURITY DEFINER functions
- Restricted function execution

✅ **Activity Logging**
- Audit trail for all admin actions
- IP address and user agent tracking
- JSONB details field for flexible metadata
- Cannot be updated or deleted (append-only)

## Database Schema

### Tables

**`admin_roles`**
- Stores role assignments
- Unique active role per user
- Supports role expiration
- Auto-updates `updated_at` via trigger

**`admin_activity_log`**
- Immutable audit trail
- Tracks all admin actions
- Status tracking (success/failure)

### Functions

**`is_admin()`**
- Returns true if user has active admin role
- Used in RLS policies

**`is_super_admin()`**
- Returns true if user has active super_admin role
- Used in RLS policies

## Setup

### 1. Apply Migration

Run the production migration:

```bash
# For remote Supabase
# Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new
# Copy and paste: supabase/migrations/20260109000000_admin_portal_production.sql

# For local Supabase
npx supabase migration up
```

### 2. Bootstrap First Admin

The migration automatically creates the first super_admin for user:
`1dd2728c-618e-41bb-bc28-1d74e40eebb7`

To bootstrap a different user, update the migration or run:

```sql
WITH deactivated AS (
  UPDATE public.admin_roles
  SET is_active = false, updated_at = NOW()
  WHERE user_id = 'YOUR_USER_ID' AND is_active = true
  RETURNING *
)
INSERT INTO public.admin_roles (user_id, role, granted_by, notes, is_active)
VALUES ('YOUR_USER_ID', 'super_admin', 'YOUR_USER_ID', 'Bootstrap', true)
ON CONFLICT (user_id) DO UPDATE
  SET role = EXCLUDED.role, is_active = EXCLUDED.is_active, updated_at = NOW();
```

## Usage

### TypeScript Types

```typescript
import {
  AdminRole,
  AdminRoleType,
  AdminRoleRow,
  AdminActivityLogRow,
  getPermissionsForRole,
  hasPermission,
  isActiveRole,
} from '@/packages/database/src/types/admin';
```

### Service Layer

```typescript
import { AdminService } from '@/packages/database/src/services/admin.service';
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
const adminService = new AdminService(supabase);

// Check permissions
const isAdmin = await adminService.isAdmin(userId);
const isSuperAdmin = await adminService.isSuperAdmin(userId);

// Get role
const role = await adminService.getAdminRole(userId);

// List roles
const roles = await adminService.listAdminRoles({ activeOnly: true });

// Create role
await adminService.createAdminRole({
  user_id: '...',
  role: 'operations_admin',
  granted_by: currentUserId,
  notes: 'New ops admin'
});

// Log activity
await adminService.logActivity(userId, {
  action: 'user:create',
  resource: 'user_123',
  status: 'success',
  details: { email: 'new@example.com' }
});
```

### API Routes

Example protected route:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  // Authenticate
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check admin access
  const { data: adminRole } = await supabase
    .from('admin_roles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (!adminRole) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  // Your logic here
  return NextResponse.json({ success: true });
}
```

## Security Best Practices

### 1. Function Permissions
Functions are SECURITY DEFINER with restricted execution:
- Cannot be called directly by public/anon/authenticated roles
- Only accessible within RLS policies

### 2. Append-Only Logs
Activity logs cannot be modified after creation:
- Updates blocked via RLS policy
- Deletes blocked via RLS policy

### 3. Active Role Enforcement
Partial unique index ensures only one active role per user:
- Prevents privilege escalation
- Automatic expiration checking

### 4. Always Log Actions
Log all admin activities for audit trail:

```typescript
await adminService.logActivity(userId, {
  action: 'role:grant',
  resource: `user:${targetUserId}`,
  status: 'success',
  details: {
    role: 'operations_admin',
    granted_by: currentUserId
  }
});
```

## Admin Permissions

### Super Admin
- users:read, users:write, users:delete
- roles:read, roles:write, roles:delete
- activity:read
- system:configure
- agents:read, agents:write, agents:execute
- finance:read, finance:write

### Operations Admin
- users:read
- roles:read
- activity:read
- agents:read, agents:write, agents:execute

### Finance Admin
- users:read
- roles:read
- activity:read
- finance:read, finance:write

### Viewer
- users:read
- roles:read
- activity:read

## Files Created

```
ubuntu-initiative/
├── supabase/migrations/
│   └── 20260109000000_admin_portal_production.sql  # Database schema
├── packages/database/src/
│   ├── types/
│   │   └── admin.ts                                # TypeScript types
│   └── services/
│       └── admin.service.ts                        # Service layer
├── apps/web/
│   ├── lib/admin/
│   │   └── middleware.ts                           # Middleware helpers
│   └── app/api/admin/
│       └── roles/
│           └── route.ts                            # Example API route
└── ADMIN_SYSTEM_README.md                          # This file
```

## Testing

### Test Admin Functions

```sql
-- Check if user is admin
SELECT public.is_admin();

-- Check if user is super admin
SELECT public.is_super_admin();

-- View all active roles
SELECT * FROM public.admin_roles WHERE is_active = true;

-- View activity logs
SELECT * FROM public.admin_activity_log ORDER BY created_at DESC LIMIT 10;
```

### Test RLS Policies

```typescript
// As non-admin user
const { data, error } = await supabase
  .from('admin_roles')
  .select('*');
// Should return empty or error (no access)

// As super admin
const { data, error } = await supabase
  .from('admin_roles')
  .select('*');
// Should return all roles
```

## Troubleshooting

### "Table admin_roles does not exist"
Run the migration: `20260109000000_admin_portal_production.sql`

### "Function is_admin() does not exist"
Migration not fully applied. Check Supabase logs.

### "No active role for user"
```sql
UPDATE public.admin_roles 
SET is_active = true, expires_at = NULL
WHERE user_id = 'YOUR_USER_ID';
```

### "Cannot update activity log"
This is by design - logs are append-only for security.

## Production Checklist

- [ ] Migration applied to production database
- [ ] First super admin bootstrapped
- [ ] RLS policies verified
- [ ] Activity logging tested
- [ ] API routes protected
- [ ] Service layer integrated
- [ ] TypeScript types imported
- [ ] Frontend admin UI created

---

**Ready for production use! 🚀**
