/**
 * Agent Metrics Calculator
 * Computes real-time performance metrics from agent_runs data
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface AgentMetrics {
  // Execution metrics
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  successRate: number;
  
  // Performance metrics
  avgExecutionTime: number;
  p50ExecutionTime: number;
  p95ExecutionTime: number;
  p99ExecutionTime: number;
  
  // Volume metrics
  itemsProcessed: number;
  runsPerDay: number;
  
  // Recent activity
  lastRunAt: string | null;
  lastRunStatus: string | null;
  recentRuns: any[];
  
  // Error tracking
  recentErrors: any[];
  errorRate: number;
  
  // Cost tracking
  totalCost: number;
  avgCostPerRun: number;
  
  // Trend data
  dailyRunCounts: { date: string; count: number; successes: number; failures: number }[];
}

/**
 * Calculate comprehensive metrics for an agent
 */
export async function calculateAgentMetrics(
  agentId: string,
  timeRangeDays: number = 7
): Promise<AgentMetrics> {
  const since = new Date();
  since.setDate(since.getDate() - timeRangeDays);
  const sinceIso = since.toISOString();

  // Fetch all runs in time range
  const { data: runs, error: runsError } = await supabase
    .from('agent_runs')
    .select('*')
    .eq('agent_id', agentId)
    .gte('started_at', sinceIso)
    .order('started_at', { ascending: false });

  if (runsError) {
    console.error('Error fetching agent runs:', runsError);
    throw runsError;
  }

  const totalRuns = runs?.length || 0;
  const successfulRuns = runs?.filter(r => r.status === 'success').length || 0;
  const failedRuns = runs?.filter(r => r.status === 'error').length || 0;

  // Basic metrics
  const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;
  const errorRate = totalRuns > 0 ? (failedRuns / totalRuns) * 100 : 0;

  // Execution time metrics
  const executionTimes = runs
    ?.filter(r => r.execution_time_ms != null)
    .map(r => r.execution_time_ms)
    .sort((a, b) => a - b) || [];

  const avgExecutionTime = executionTimes.length > 0
    ? executionTimes.reduce((sum, t) => sum + t, 0) / executionTimes.length
    : 0;

  const p50ExecutionTime = getPercentile(executionTimes, 50);
  const p95ExecutionTime = getPercentile(executionTimes, 95);
  const p99ExecutionTime = getPercentile(executionTimes, 99);

  // Volume metrics
  const itemsProcessed = runs
    ?.reduce((sum, r) => sum + (r.items_processed || 0), 0) || 0;

  const runsPerDay = totalRuns / timeRangeDays;

  // Recent activity
  const recentRuns = runs?.slice(0, 10) || [];
  const lastRun = runs?.[0];
  const lastRunAt = lastRun?.started_at || null;
  const lastRunStatus = lastRun?.status || null;

  // Recent errors
  const recentErrors = runs
    ?.filter(r => r.status === 'error')
    .slice(0, 5)
    .map(r => ({
      id: r.id,
      timestamp: r.started_at,
      message: r.error_message,
      stack: r.error_stack
    })) || [];

  // Cost metrics
  const { data: costs } = await supabase
    .from('agent_costs')
    .select('*')
    .eq('agent_id', agentId)
    .gte('created_at', sinceIso);

  const totalCost = costs?.reduce((sum, c) => sum + (Number(c.estimated_cost_usd) || 0), 0) || 0;
  const avgCostPerRun = totalRuns > 0 ? totalCost / totalRuns : 0;

  // Daily trend data
  const dailyRunCounts = calculateDailyTrends(runs || [], timeRangeDays);

  return {
    totalRuns,
    successfulRuns,
    failedRuns,
    successRate: Math.round(successRate * 100) / 100,
    avgExecutionTime: Math.round(avgExecutionTime),
    p50ExecutionTime: Math.round(p50ExecutionTime),
    p95ExecutionTime: Math.round(p95ExecutionTime),
    p99ExecutionTime: Math.round(p99ExecutionTime),
    itemsProcessed,
    runsPerDay: Math.round(runsPerDay * 100) / 100,
    lastRunAt,
    lastRunStatus,
    recentRuns: recentRuns.map(r => ({
      id: r.id,
      status: r.status,
      startedAt: r.started_at,
      completedAt: r.completed_at,
      executionTime: r.execution_time_ms,
      itemsProcessed: r.items_processed
    })),
    recentErrors,
    errorRate: Math.round(errorRate * 100) / 100,
    totalCost: Math.round(totalCost * 1000000) / 1000000,
    avgCostPerRun: Math.round(avgCostPerRun * 1000000) / 1000000,
    dailyRunCounts
  };
}

/**
 * Calculate percentile from sorted array
 */
function getPercentile(sortedArray: number[], percentile: number): number {
  if (sortedArray.length === 0) return 0;
  
  const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
  return sortedArray[Math.max(0, index)];
}

/**
 * Calculate daily run counts for trend visualization
 */
function calculateDailyTrends(
  runs: any[],
  days: number
): { date: string; count: number; successes: number; failures: number }[] {
  const dailyMap = new Map<string, { count: number; successes: number; failures: number }>();

  // Initialize all days in range
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dailyMap.set(dateStr, { count: 0, successes: 0, failures: 0 });
  }

  // Aggregate runs by day
  runs.forEach(run => {
    const dateStr = run.started_at.split('T')[0];
    const existing = dailyMap.get(dateStr) || { count: 0, successes: 0, failures: 0 };
    
    existing.count++;
    if (run.status === 'success') existing.successes++;
    if (run.status === 'error') existing.failures++;
    
    dailyMap.set(dateStr, existing);
  });

  // Convert to array and sort by date
  return Array.from(dailyMap.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate SLA metrics across all agents
 */
export async function calculateSLAMetrics(timeRangeDays: number = 7) {
  const since = new Date();
  since.setDate(since.getDate() - timeRangeDays);

  // Get all runs
  const { data: allRuns } = await supabase
    .from('agent_runs')
    .select('*')
    .gte('started_at', since.toISOString());

  const totalRuns = allRuns?.length || 0;
  const successfulRuns = allRuns?.filter(r => r.status === 'success').length || 0;
  const failedRuns = allRuns?.filter(r => r.status === 'error').length || 0;

  const uptime = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;
  const errorRate = totalRuns > 0 ? (failedRuns / totalRuns) * 100 : 0;

  const executionTimes = allRuns
    ?.filter(r => r.execution_time_ms != null)
    .map(r => r.execution_time_ms)
    .sort((a, b) => a - b) || [];

  const avgResponseTime = executionTimes.length > 0
    ? executionTimes.reduce((sum, t) => sum + t, 0) / executionTimes.length
    : 0;

  const p95Latency = getPercentile(executionTimes, 95);

  const dailyRuns = totalRuns / timeRangeDays;

  // Get cost data
  const { data: costs } = await supabase
    .from('agent_costs')
    .select('estimated_cost_usd')
    .gte('created_at', since.toISOString());

  const totalCost = costs?.reduce((sum, c) => sum + (Number(c.estimated_cost_usd) || 0), 0) || 0;
  const costPerRun = totalRuns > 0 ? totalCost / totalRuns : 0;

  return {
    uptime: `${uptime.toFixed(2)}%`,
    avgResponseTime: `${(avgResponseTime / 1000).toFixed(2)}s`,
    errorRate: `${errorRate.toFixed(2)}%`,
    p95Latency: `${(p95Latency / 1000).toFixed(2)}s`,
    dailyRuns: Math.round(dailyRuns),
    costPerRun: `$${costPerRun.toFixed(6)}`,
    totalCost: `$${totalCost.toFixed(2)}`,
    timeRange: `${timeRangeDays} days`
  };
}

/**
 * Get agent health status
 */
export async function getAgentHealth(agentId?: string) {
  const { data, error } = await supabase.rpc('get_agent_health', {
    agent_filter: agentId || null
  });

  if (error) {
    console.error('Error fetching agent health:', error);
    return [];
  }

  return data.map((agent: any) => ({
    agentId: agent.agent_id,
    totalRuns: Number(agent.total_runs),
    successfulRuns: Number(agent.successful_runs),
    failedRuns: Number(agent.failed_runs),
    successRate: Number(agent.success_rate),
    avgExecutionTime: Number(agent.avg_execution_time),
    lastRunAt: agent.last_run_at,
    lastRunStatus: agent.last_run_status,
    status: determineHealthStatus(
      Number(agent.success_rate),
      agent.last_run_status,
      agent.last_run_at
    )
  }));
}

/**
 * Determine overall health status
 */
function determineHealthStatus(
  successRate: number,
  lastRunStatus: string | null,
  lastRunAt: string | null
): 'healthy' | 'degraded' | 'critical' | 'unknown' {
  if (!lastRunAt) return 'unknown';

  const hoursSinceLastRun = (Date.now() - new Date(lastRunAt).getTime()) / (1000 * 60 * 60);

  if (successRate >= 95 && lastRunStatus === 'success' && hoursSinceLastRun < 24) {
    return 'healthy';
  }

  if (successRate >= 80 || hoursSinceLastRun < 48) {
    return 'degraded';
  }

  return 'critical';
}

/**
 * Track agent execution cost
 */
export async function trackExecutionCost(
  runId: string,
  agentId: string,
  costs: {
    stripeApiCalls?: number;
    supabaseQueries?: number;
    aiTokensUsed?: number;
    externalApiCalls?: number;
  }
) {
  // Estimate costs (adjust rates as needed)
  const COST_PER_STRIPE_CALL = 0.0001;
  const COST_PER_AI_TOKEN = 0.000001;
  const COST_PER_EXTERNAL_CALL = 0.0005;

  const estimatedCost =
    (costs.stripeApiCalls || 0) * COST_PER_STRIPE_CALL +
    (costs.aiTokensUsed || 0) * COST_PER_AI_TOKEN +
    (costs.externalApiCalls || 0) * COST_PER_EXTERNAL_CALL;

  await supabase.from('agent_costs').insert({
    run_id: runId,
    agent_id: agentId,
    stripe_api_calls: costs.stripeApiCalls || 0,
    supabase_queries: costs.supabaseQueries || 0,
    ai_tokens_used: costs.aiTokensUsed || 0,
    external_api_calls: costs.externalApiCalls || 0,
    estimated_cost_usd: estimatedCost
  });
}
