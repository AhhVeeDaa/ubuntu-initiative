/**
 * Agent Retry Logic
 * Implements exponential backoff for failed agent executions
 */

import { createClient } from '@supabase/supabase-js';
import { executeAgent } from './agent-factory';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,  // Start with 1 second
  maxDelayMs: 30000,     // Max 30 seconds between retries
  backoffMultiplier: 2   // Exponential: 1s, 2s, 4s, 8s...
};

/**
 * Execute agent with automatic retry on failure
 */
export async function executeWithRetry(
  agentId: string,
  runId: string,
  trigger: string = 'manual',
  inputData?: any,
  config: Partial<RetryConfig> = {}
): Promise<any> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < retryConfig.maxRetries) {
    try {
      // Update retry count in database
      await supabase
        .from('agent_runs')
        .update({ retry_count: attempt })
        .eq('id', runId);

      // Attempt execution
      const result = await executeAgent(agentId, runId, trigger, inputData);
      
      // Success! Reset circuit breaker
      await circuitBreaker.recordSuccess(agentId);
      
      return result;

    } catch (error: any) {
      lastError = error;
      attempt++;

      // Log retry event
      await supabase.from('agent_events').insert({
        run_id: runId,
        agent_id: agentId,
        event_type: 'retry',
        message: `Retry attempt ${attempt}/${retryConfig.maxRetries} failed: ${error.message}`,
        severity: 'warning',
        data: { attempt, maxRetries: retryConfig.maxRetries, error: error.message }
      });

      // Don't retry if we've hit max attempts
      if (attempt >= retryConfig.maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        retryConfig.initialDelayMs * Math.pow(retryConfig.backoffMultiplier, attempt - 1),
        retryConfig.maxDelayMs
      );

      // Log delay
      await supabase.from('agent_events').insert({
        run_id: runId,
        agent_id: agentId,
        event_type: 'retry_delay',
        message: `Waiting ${delay}ms before retry attempt ${attempt + 1}`,
        severity: 'info',
        data: { delayMs: delay, nextAttempt: attempt + 1 }
      });

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // All retries failed - record in circuit breaker
  await circuitBreaker.recordFailure(agentId);

  // Log final failure
  await supabase.from('agent_events').insert({
    run_id: runId,
    agent_id: agentId,
    event_type: 'retry_exhausted',
    message: `All ${retryConfig.maxRetries} retry attempts failed`,
    severity: 'error',
    data: { attempts: attempt, error: lastError?.message }
  });

  throw lastError || new Error('Agent execution failed after retries');
}

/**
 * Circuit Breaker Pattern
 * Prevents cascading failures by temporarily blocking failing agents
 */
class CircuitBreaker {
  private failures: Map<string, number> = new Map();
  private lastFailureTime: Map<string, number> = new Map();
  private circuitState: Map<string, 'closed' | 'open' | 'half-open'> = new Map();
  
  private readonly failureThreshold = 5;     // Open circuit after 5 failures
  private readonly resetTimeMs = 60000;      // Try again after 1 minute
  private readonly halfOpenAttempts = 3;     // Allow 3 test attempts when half-open

  /**
   * Check if circuit is open (agent blocked)
   */
  isOpen(agentId: string): boolean {
    const state = this.circuitState.get(agentId) || 'closed';
    
    if (state === 'open') {
      const lastFailure = this.lastFailureTime.get(agentId) || 0;
      const timeSinceFailure = Date.now() - lastFailure;
      
      if (timeSinceFailure >= this.resetTimeMs) {
        // Transition to half-open to test recovery
        this.circuitState.set(agentId, 'half-open');
        return false;
      }
      
      return true; // Circuit still open
    }
    
    return false;
  }

  /**
   * Get current circuit state
   */
  getState(agentId: string): 'closed' | 'open' | 'half-open' {
    return this.circuitState.get(agentId) || 'closed';
  }

  /**
   * Record a failure
   */
  async recordFailure(agentId: string): Promise<void> {
    const currentFailures = this.failures.get(agentId) || 0;
    const newFailures = currentFailures + 1;
    
    this.failures.set(agentId, newFailures);
    this.lastFailureTime.set(agentId, Date.now());

    const currentState = this.circuitState.get(agentId) || 'closed';

    if (currentState === 'half-open') {
      // Failed during recovery test - back to open
      this.circuitState.set(agentId, 'open');
      
      await supabase.from('agent_events').insert({
        agent_id: agentId,
        event_type: 'circuit_breaker',
        message: `Circuit breaker reopened for ${agentId} - recovery failed`,
        severity: 'critical',
        data: { state: 'open', failures: newFailures }
      });
      
    } else if (newFailures >= this.failureThreshold) {
      // Exceeded threshold - open circuit
      this.circuitState.set(agentId, 'open');
      
      await supabase.from('agent_events').insert({
        agent_id: agentId,
        event_type: 'circuit_breaker',
        message: `Circuit breaker opened for ${agentId} after ${newFailures} failures`,
        severity: 'critical',
        data: { state: 'open', failures: newFailures, resetInMs: this.resetTimeMs }
      });
    }
  }

  /**
   * Record a success
   */
  async recordSuccess(agentId: string): Promise<void> {
    const previousState = this.circuitState.get(agentId) || 'closed';
    
    // Reset failure count
    this.failures.set(agentId, 0);
    this.circuitState.set(agentId, 'closed');

    if (previousState !== 'closed') {
      await supabase.from('agent_events').insert({
        agent_id: agentId,
        event_type: 'circuit_breaker',
        message: `Circuit breaker closed for ${agentId} - recovered`,
        severity: 'info',
        data: { state: 'closed', previousState }
      });
    }
  }

  /**
   * Get failure count for agent
   */
  getFailureCount(agentId: string): number {
    return this.failures.get(agentId) || 0;
  }

  /**
   * Get all circuit states
   */
  getAllStates(): Record<string, { state: string; failures: number; lastFailure?: number }> {
    const states: Record<string, any> = {};
    
    for (const [agentId, state] of this.circuitState.entries()) {
      states[agentId] = {
        state,
        failures: this.failures.get(agentId) || 0,
        lastFailure: this.lastFailureTime.get(agentId)
      };
    }
    
    return states;
  }

  /**
   * Manually reset circuit (admin override)
   */
  async reset(agentId: string): Promise<void> {
    this.failures.set(agentId, 0);
    this.circuitState.set(agentId, 'closed');
    
    await supabase.from('agent_events').insert({
      agent_id: agentId,
      event_type: 'circuit_breaker',
      message: `Circuit breaker manually reset for ${agentId}`,
      severity: 'info',
      data: { state: 'closed', manual: true }
    });
  }
}

// Singleton instance
export const circuitBreaker = new CircuitBreaker();

/**
 * Execute agent with circuit breaker protection
 */
export async function executeWithCircuitBreaker(
  agentId: string,
  runId: string,
  trigger: string = 'manual',
  inputData?: any
): Promise<any> {
  // Check circuit breaker
  if (circuitBreaker.isOpen(agentId)) {
    const state = circuitBreaker.getState(agentId);
    const failures = circuitBreaker.getFailureCount(agentId);
    
    await supabase.from('agent_events').insert({
      run_id: runId,
      agent_id: agentId,
      event_type: 'circuit_breaker_blocked',
      message: `Agent execution blocked by circuit breaker (${failures} recent failures)`,
      severity: 'warning',
      data: { state, failures }
    });

    throw new Error(
      `Agent ${agentId} is temporarily unavailable due to repeated failures. ` +
      `Circuit breaker is ${state}. Please try again later.`
    );
  }

  // Execute with retry
  return await executeWithRetry(agentId, runId, trigger, inputData);
}
