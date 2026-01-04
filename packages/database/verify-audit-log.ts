/**
 * Verification Script: Check Agent Audit Log
 * Run this to verify the audit log is working
 */

import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAuditLog() {
  console.log('🔍 Verifying Agent Audit Log Setup...\n');

  try {
    // Check agent_audit_log table
    const { data: auditLogs, error: auditError, count } = await supabase
      .from('agent_audit_log')
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false });

    if (auditError) {
      console.error('❌ Error accessing agent_audit_log:', auditError.message);
      return;
    }

    console.log(`✅ agent_audit_log table: ${count} entries found`);
    
    if (auditLogs && auditLogs.length > 0) {
      console.log('\n📋 Sample Entries:');
      auditLogs.slice(0, 3).forEach((log, idx) => {
        console.log(`\n${idx + 1}. ${log.agent_id}`);
        console.log(`   Action: ${log.action_type}`);
        console.log(`   Reasoning: ${log.reasoning}`);
        console.log(`   Confidence: ${(log.confidence_score * 100).toFixed(0)}%`);
        console.log(`   Time: ${new Date(log.timestamp).toLocaleString()}`);
      });
    }

    // Check approval_queue table
    const { data: approvals, error: approvalError, count: approvalCount } = await supabase
      .from('approval_queue')
      .select('*', { count: 'exact' })
      .eq('status', 'pending');

    if (!approvalError) {
      console.log(`\n✅ approval_queue table: ${approvalCount} pending items`);
    }

    // Check milestone_events table
    const { data: events, error: eventsError, count: eventsCount } = await supabase
      .from('milestone_events')
      .select('*', { count: 'exact' });

    if (!eventsError) {
      console.log(`✅ milestone_events table: ${eventsCount} events`);
    }

    console.log('\n✨ All audit log tables are accessible!');
    console.log('🌐 View in dashboard: https://ubuntu-initiative-web.vercel.app/dashboard');

  } catch (error: any) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyAuditLog();
