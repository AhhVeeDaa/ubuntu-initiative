/**
 * Dashboard Authentication Guard
 * Protects dashboard access - redirects to login if not authenticated
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push('/login');
        return;
      }

      const { data: adminRole, error: roleError } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (roleError || !adminRole) {
        await supabase.auth.signOut();
        router.push('/login');
        return;
      }

      if (adminRole.expires_at && new Date(adminRole.expires_at) <= new Date()) {
        await supabase.auth.signOut();
        router.push('/login');
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-[hsl(var(--primary))]/30 border-t-[hsl(var(--primary))] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
