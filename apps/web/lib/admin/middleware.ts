/**
 * Admin Middleware
 * Next.js middleware for protecting admin routes
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export interface AdminContext {
  userId: string;
  role: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

/**
 * Create admin service helper
 */
function createAdminService(supabaseUrl: string, supabaseKey: string) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  return {
    async getAdminRole(userId: string) {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error || !data) return null;

      // Check expiration
      if (data.expires_at && new Date(data.expires_at) <= new Date()) {
        return null;
      }

      return data;
    }
  };
}

/**
 * Middleware to check if user is authenticated admin
 */
export async function requireAdmin() {
  return NextResponse.json(
    { error: 'Use getAdminContext in route handlers' },
    { status: 500 }
  );
}

/**
 * Middleware to check if user is super admin
 */
export async function requireSuperAdmin() {
  return NextResponse.json(
    { error: 'Use getAdminContext in route handlers' },
    { status: 500 }
  );
}

/**
 * Get admin context for current user
 * Use this in API route handlers
 */
export async function getAdminContext(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string
): Promise<AdminContext | null> {
  const adminService = createAdminService(supabaseUrl, supabaseKey);
  const adminRole = await adminService.getAdminRole(userId);
  
  if (!adminRole) {
    return null;
  }

  return {
    userId,
    role: adminRole.role,
    isAdmin: true,
    isSuperAdmin: adminRole.role === 'super_admin',
  };
}
