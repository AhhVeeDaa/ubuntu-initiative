# Quick Fix Guide - Remaining ESLint Issues
**For:** Ubuntu Initiative  
**Status:** Optional improvements for code quality

---

## 🎯 Quick Wins (Easy Fixes)

### 1. Replace `any` with `unknown` in Error Handling

**Find:** `catch (error: any)`  
**Replace with:**
```typescript
catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

**Files affected:** ~30 files  
**Time estimate:** 15-20 minutes  
**Impact:** Improves type safety

---

### 2. Remove Unused Variables

**Pattern 1 - Unused imports:**
```typescript
// ❌ Before
import { Foo, Bar, Baz } from 'library';
// Only using Foo

// ✅ After
import { Foo } from 'library';
```

**Pattern 2 - Unused function parameters:**
```typescript
// ❌ Before
const { data, error } = await supabase.from('table').select();
// Not using 'error'

// ✅ After
const { data } = await supabase.from('table').select();
// OR prefix with underscore if you want to keep it for documentation
const { data, error: _error } = await supabase.from('table').select();
```

**Files affected:** ~19 instances  
**Time estimate:** 10 minutes  
**Impact:** Code cleanliness

---

### 3. Fix TypeScript Comment

**File:** `/apps/web/lib/agents/funding-grant-agent.ts:108`

**Change:**
```typescript
// ❌ Before
// @ts-ignore

// ✅ After
// @ts-expect-error - Supabase types don't match our custom schema
```

**Time estimate:** 1 minute  
**Impact:** Best practices

---

## 🔧 Medium Effort Fixes

### 4. Add Proper Types for API Responses

Instead of:
```typescript
export async function POST(request: Request) {
  const data: any = await request.json();
  // ...
}
```

Use:
```typescript
interface ApprovalRequest {
  action: 'approve' | 'reject';
  approvalQueueId: string;
  policyUpdateId: string;
  userId?: string;
  notes?: string;
  reason?: string;
}

export async function POST(request: Request) {
  const data: ApprovalRequest = await request.json();
  // ...
}
```

**Files affected:** All API routes  
**Time estimate:** 1-2 hours  
**Impact:** Significant type safety improvement

---

### 5. Create Supabase Type Definitions

Generate types from your Supabase schema:

```bash
# Install Supabase CLI
npm install -g supabase

# Generate types
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > apps/web/types/supabase.ts
```

Then use them:
```typescript
import { Database } from '@/types/supabase';

const supabase = createClient<Database>(url, key);
```

**Time estimate:** 30 minutes  
**Impact:** Complete type safety for database operations

---

## 📊 Issue Breakdown by Priority

### High Priority (Affects Runtime Safety)
- [ ] Replace `any` in error handlers (30 instances)
- [ ] Add types for API request/response bodies (15 files)

### Medium Priority (Code Quality)
- [ ] Remove unused variables (19 instances)
- [ ] Add Supabase type definitions
- [ ] Replace `any` in utility functions (10 instances)

### Low Priority (Nice to Have)
- [ ] Fix `@ts-ignore` → `@ts-expect-error` (1 instance)
- [ ] Add JSDoc comments
- [ ] Remove unused imports

---

## 🚀 Automated Fix Script

You can auto-fix some issues with ESLint:

```bash
# Fix auto-fixable issues in web app
npm run lint -w web -- --fix

# Fix auto-fixable issues in dashboard app
npm run lint -w dashboard -- --fix
```

**Note:** This will only fix simple issues like:
- Removing unused imports
- Fixing indentation
- Adding missing semicolons

---

## 📝 Example: Complete File Fix

**Before** (`/apps/web/app/api/approval/route.ts`):
```typescript
export async function POST(request: Request) {
  try {
    const { 
      action, 
      approvalQueueId, 
      policyUpdateId, 
      userId, 
      notes, 
      reason 
    } = await request.json();
    
    // ... rest of code
  } catch (error: any) {
    console.error('Approval API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

**After:**
```typescript
interface ApprovalRequest {
  action: 'approve' | 'reject';
  approvalQueueId: string;
  policyUpdateId: string;
  userId?: string;
  notes?: string;
  reason?: string;
}

interface ApprovalResponse {
  success: boolean;
  error?: string;
}

export async function POST(request: Request): Promise<NextResponse<ApprovalResponse>> {
  try {
    const body: ApprovalRequest = await request.json();
    
    // ... rest of code
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Approval API error:', errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
```

---

## ⏱️ Time Estimates

| Task | Time | Impact |
|------|------|--------|
| Fix all error handlers | 20 min | High |
| Remove unused variables | 10 min | Medium |
| Add API types | 2 hours | High |
| Generate Supabase types | 30 min | High |
| Fix @ts-ignore | 1 min | Low |
| **Total** | **~3 hours** | **Significant** |

---

## 🎯 Recommended Approach

### Week 1: Critical Type Safety
1. Generate Supabase types
2. Fix error handlers (replace `any` with `unknown`)
3. Add types to API routes

### Week 2: Code Cleanup
1. Remove unused variables
2. Remove unused imports
3. Fix TypeScript comments

### Week 3: Documentation & Tooling
1. Add JSDoc comments
2. Set up pre-commit hooks
3. Add stricter ESLint rules

---

## 📚 Resources

- [TypeScript Handbook - Error Handling](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- [Supabase Type Generation](https://supabase.com/docs/guides/api/generating-types)
- [ESLint Rules Reference](https://typescript-eslint.io/rules/)

---

**Created:** 2026-01-05  
**Last Updated:** 2026-01-05  
**Status:** Ready to implement
