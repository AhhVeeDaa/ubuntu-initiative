/**
 * Public Agent Audit Log API
 * GET /api/agents/audit-log
 * 
 * Returns approved agent actions visible to the public
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get public audit log entries
    const { data: logs, error } = await supabase
      .from('agent_public_audit_log')
      .select('*')
      .order('approved_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Audit log fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch audit log' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      logs: logs || [],
      count: logs?.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Audit log error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
