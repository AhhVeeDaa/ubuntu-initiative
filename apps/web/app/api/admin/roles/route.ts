/**
 * Admin Roles API Route
 * GET /api/admin/roles - List all admin roles (Super Admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is super admin
    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!adminRole || adminRole.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden: Super admin access required' },
        { status: 403 }
      );
    }

    // Fetch all admin roles
    const { data: roles, error } = await supabase
      .from('admin_roles')
      .select('*')
      .order('granted_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ roles }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching admin roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
