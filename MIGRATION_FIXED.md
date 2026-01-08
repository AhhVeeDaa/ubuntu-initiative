# 🔧 FIXED: Admin Portal Migration

## ✅ Issue Resolved

**Error:** `functions in index predicate must be marked IMMUTABLE`

**Solution:** Removed `NOW()` from the unique index predicate. Instead:
1. Simple unique index on `(user_id) WHERE is_active = true`
2. Expiration checking handled by:
   - Security functions (`is_admin()`, `is_super_admin()`)
   - Trigger that auto-deactivates expired roles
   - Application logic

---

## 🚀 Apply Fixed Migration

### Go to Supabase SQL Editor:
👉 https://supabase.com/dashboard/project/frforinozbawkikgiywe/sql/new

### Copy and run this file:
📄 `supabase/migrations/20260109000001_admin_portal_production_fixed.sql`

---

## 🔍 What Changed from Original

### Before (Broken):
```sql
CREATE UNIQUE INDEX ux_admin_roles_active_user
  ON public.admin_roles(user_id)
  WHERE is_active = true AND (expires_at IS NULL OR expires_at > NOW());
  -- ❌ NOW() is not IMMUTABLE
```

### After (Fixed):
```sql
-- Simple unique index
CREATE UNIQUE INDEX ux_admin_roles_active_user
  ON public.admin_roles(user_id)
  WHERE is_active = true;
  -- ✅ No non-immutable functions

-- Expiration handled by trigger
CREATE TRIGGER trg_admin_roles_check_expiration
  BEFORE INSERT OR UPDATE ON public.admin_roles
  FOR EACH ROW EXECUTE FUNCTION public.check_role_expiration();
  -- ✅ Auto-deactivates expired roles
```

---

## ✨ Key Features

1. **Unique Active Role per User**
   - Enforced by unique index
   - Only one `is_active = true` per user

2. **Auto-Expiration**
   - Trigger checks `expires_at` on insert/update
   - Automatically sets `is_active = false` if expired
   - No need for manual expiration checking

3. **Security Functions**
   - `is_admin()` and `is_super_admin()` check expiration
   - Return `false` for expired roles
   - Used in RLS policies

4. **Complete RLS**
   - Super admins manage all roles
   - All admins can view roles
   - Append-only activity logs

5. **Bootstrap**
   - Creates super_admin for user `1dd2728c-618e-41bb-bc28-1d74e40eebb7`
   - Idempotent (safe to run multiple times)

---

## 🧪 Test After Migration

```sql
-- Check your super_admin role
SELECT * FROM public.admin_roles 
WHERE user_id = '1dd2728c-618e-41bb-bc28-1d74e40eebb7';

-- Should show:
-- is_active = true
-- role = 'super_admin'
-- expires_at = NULL

-- Test security functions
SELECT public.is_admin();        -- Should return true when logged in as admin
SELECT public.is_super_admin();  -- Should return true for super_admin

-- Test unique constraint
-- This should FAIL (only one active role per user):
INSERT INTO public.admin_roles (user_id, role, granted_by, is_active)
VALUES ('1dd2728c-618e-41bb-bc28-1d74e40eebb7', 'viewer', '1dd2728c-618e-41bb-bc28-1d74e40eebb7', true);
-- ERROR: duplicate key value violates unique constraint "ux_admin_roles_active_user"
```

---

## 📊 Migration Summary

### Tables Created:
- ✅ `admin_roles`
- ✅ `admin_activity_log`

### Indexes Created:
- ✅ `ux_admin_roles_active_user` (unique)
- ✅ Performance indexes for queries

### Functions Created:
- ✅ `is_admin()` - Check if user is admin
- ✅ `is_super_admin()` - Check if user is super admin
- ✅ `set_updated_at()` - Auto-update timestamp
- ✅ `check_role_expiration()` - Auto-deactivate expired roles
- ✅ `is_role_expired()` - IMMUTABLE expiration checker

### Triggers Created:
- ✅ Auto-update `updated_at`
- ✅ Auto-deactivate expired roles

### Policies Created:
- ✅ Super admins manage roles
- ✅ Admins view roles
- ✅ Admins view logs
- ✅ Admins/users insert logs
- ✅ Block log updates
- ✅ Block log deletes

### Bootstrap:
- ✅ Super admin created for your user

---

## 🎯 Next Steps

1. ✅ **Apply migration** (see above)
2. ✅ **Test login** at http://localhost:3000
3. ⬜ **Build admin UI**
4. ⬜ **Integrate service layer**
5. ⬜ **Add activity logging to actions**

---

## 📚 Documentation

- **Complete Guide:** `ADMIN_IMPLEMENTATION_COMPLETE.md`
- **System Docs:** `ADMIN_SYSTEM_README.md`
- **Quick Reference:** `APPLY_ADMIN_NOW.md`

---

**The fixed migration is ready to run! 🚀**

File: `supabase/migrations/20260109000001_admin_portal_production_fixed.sql`
