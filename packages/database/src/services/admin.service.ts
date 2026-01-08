/**
 * Admin Service
 * Server-side service for admin role and activity management
 */

import { SupabaseClient } from '@supabase/supabase-js';
import {
  AdminRoleRow,
  AdminActivityLogRow,
  AdminRoleType,
  CreateAdminRoleRequest,
  UpdateAdminRoleRequest,
  LogActivityRequest,
  ActivityStatus,
  isActiveRole,
} from '../types/admin';

export class AdminService {
  constructor(private supabase: SupabaseClient) {}

  // ============================================================================
  // ROLE MANAGEMENT
  // ============================================================================

  /**
   * Get admin role for a specific user
   */
  async getAdminRole(userId: string): Promise<AdminRoleRow | null> {
    const { data, error } = await this.supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching admin role:', error);
      return null;
    }

    return data;
  }

  /**
   * Check if user has admin access
   */
  async isAdmin(userId: string): Promise<boolean> {
    const role = await this.getAdminRole(userId);
    return role ? isActiveRole(role) : false;
  }

  /**
   * Check if user is super admin
   */
  async isSuperAdmin(userId: string): Promise<boolean> {
    const role = await this.getAdminRole(userId);
    return role ? isActiveRole(role) && role.role === 'super_admin' : false;
  }

  /**
   * List all admin roles
   */
  async listAdminRoles(options?: {
    activeOnly?: boolean;
    role?: AdminRoleType;
  }): Promise<AdminRoleRow[]> {
    let query = this.supabase.from('admin_roles').select('*');

    if (options?.activeOnly) {
      query = query.eq('is_active', true);
    }

    if (options?.role) {
      query = query.eq('role', options.role);
    }

    const { data, error } = await query.order('granted_at', { ascending: false });

    if (error) {
      console.error('Error listing admin roles:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Create a new admin role
   */
  async createAdminRole(request: CreateAdminRoleRequest): Promise<AdminRoleRow> {
    const { data, error } = await this.supabase
      .from('admin_roles')
      .insert({
        user_id: request.user_id,
        role: request.role,
        granted_by: request.granted_by,
        notes: request.notes,
        expires_at: request.expires_at,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating admin role:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update an existing admin role
   */
  async updateAdminRole(
    userId: string,
    updates: UpdateAdminRoleRequest
  ): Promise<AdminRoleRow> {
    const { data, error } = await this.supabase
      .from('admin_roles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating admin role:', error);
      throw error;
    }

    return data;
  }

  /**
   * Deactivate an admin role
   */
  async deactivateAdminRole(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('admin_roles')
      .update({ is_active: false })
      .eq('user_id', userId);

    if (error) {
      console.error('Error deactivating admin role:', error);
      throw error;
    }
  }

  // ============================================================================
  // ACTIVITY LOGGING
  // ============================================================================

  /**
   * Log an admin activity
   */
  async logActivity(userId: string, request: LogActivityRequest): Promise<void> {
    const { error } = await this.supabase
      .from('admin_activity_log')
      .insert({
        user_id: userId,
        action: request.action,
        resource: request.resource,
        status: request.status || ActivityStatus.SUCCESS,
        details: request.details,
        ip_address: request.ip_address,
        user_agent: request.user_agent,
      });

    if (error) {
      console.error('Error logging activity:', error);
      // Don't throw - logging failure shouldn't break the main operation
    }
  }

  /**
   * Get activity logs with pagination
   */
  async getActivityLogs(options?: {
    userId?: string;
    action?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<AdminActivityLogRow[]> {
    let query = this.supabase
      .from('admin_activity_log')
      .select('*')
      .order('created_at', { ascending: false });

    if (options?.userId) {
      query = query.eq('user_id', options.userId);
    }

    if (options?.action) {
      query = query.eq('action', options.action);
    }

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get activity log count
   */
  async getActivityLogCount(options?: {
    userId?: string;
    action?: string;
    status?: string;
  }): Promise<number> {
    let query = this.supabase
      .from('admin_activity_log')
      .select('*', { count: 'exact', head: true });

    if (options?.userId) {
      query = query.eq('user_id', options.userId);
    }

    if (options?.action) {
      query = query.eq('action', options.action);
    }

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    const { count, error } = await query;

    if (error) {
      console.error('Error counting activity logs:', error);
      throw error;
    }

    return count || 0;
  }
}
