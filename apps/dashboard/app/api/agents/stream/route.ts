/**
 * Server-Sent Events (SSE) Stream for Real-Time Agent Monitoring
 * GET /api/agents/stream
 * 
 * Provides real-time updates about agent execution via SSE.
 * Clients receive events as they happen without polling.
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Helper to send SSE messages
      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial connection success
      sendEvent({
        type: 'connected',
        message: 'Agent monitoring stream connected',
        timestamp: new Date().toISOString()
      });

      // Subscribe to agent events
      const eventsChannel = supabase
        .channel('agent_events_stream')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'agent_events'
          },
          (payload) => {
            sendEvent({
              type: 'agent_event',
              ...payload.new,
              timestamp: new Date().toISOString()
            });
          }
        )
        .subscribe();

      // Subscribe to run status changes
      const runsChannel = supabase
        .channel('agent_runs_stream')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'agent_runs'
          },
          (payload) => {
            sendEvent({
              type: 'status_change',
              ...payload.new,
              timestamp: new Date().toISOString()
            });
          }
        )
        .subscribe();

      // Heartbeat every 30 seconds to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch (error) {
          clearInterval(heartbeat);
        }
      }, 30000);

      // Cleanup on client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        eventsChannel.unsubscribe();
        runsChannel.unsubscribe();
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering in nginx
    },
  });
}
