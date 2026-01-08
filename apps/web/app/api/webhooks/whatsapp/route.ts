/**
 * WhatsApp Webhook Handler
 * Receives and processes incoming WhatsApp messages from Meta Cloud API
 * 
 * @route /api/webhooks/whatsapp
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    verifyWebhookSignature,
    hashPhoneNumber,
    parseCommand,
    processApprovalCommand,
    canPerformAction,
    PERMISSIONS
} from '@/lib/whatsapp';

// Webhook verification (GET request from Meta)
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const verifyToken = process.env.META_WHATSAPP_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === verifyToken) {
        console.log('[WhatsApp Webhook] Verification successful');
        return new NextResponse(challenge, { status: 200 });
    }

    console.warn('[WhatsApp Webhook] Verification failed');
    return new NextResponse('Forbidden', { status: 403 });
}

// Message handling (POST request from Meta)
export async function POST(request: NextRequest) {
    const rawBody = await request.text();

    // Verify webhook signature
    const signature = request.headers.get('x-hub-signature-256');
    if (!verifyWebhookSignature(signature, rawBody)) {
        console.warn('[WhatsApp Webhook] Invalid signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    let body: WebhookPayload;
    try {
        body = JSON.parse(rawBody);
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Process each entry
    for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
            if (change.field !== 'messages') continue;

            const value = change.value;

            // Handle status updates
            if (value.statuses) {
                await handleStatusUpdates(value.statuses);
            }

            // Handle incoming messages
            if (value.messages) {
                await handleIncomingMessages(value.messages, value.contacts);
            }
        }
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true }, { status: 200 });
}

/**
 * Handle message status updates (sent, delivered, read)
 */
async function handleStatusUpdates(statuses: StatusUpdate[]) {
    const supabase = await createClient();

    for (const status of statuses) {
        const updateData: Record<string, unknown> = {
            status: status.status
        };

        switch (status.status) {
            case 'sent':
                updateData.sent_at = new Date(parseInt(status.timestamp) * 1000).toISOString();
                break;
            case 'delivered':
                updateData.delivered_at = new Date(parseInt(status.timestamp) * 1000).toISOString();
                break;
            case 'read':
                updateData.read_at = new Date(parseInt(status.timestamp) * 1000).toISOString();
                break;
            case 'failed':
                updateData.failed_at = new Date(parseInt(status.timestamp) * 1000).toISOString();
                updateData.error_code = status.errors?.[0]?.code?.toString();
                updateData.error_message = status.errors?.[0]?.message;
                break;
        }

        await supabase
            .from('whatsapp_notifications')
            .update(updateData)
            .eq('meta_message_id', status.id);
    }
}

/**
 * Handle incoming messages
 */
async function handleIncomingMessages(
    messages: IncomingMessage[],
    contacts: Contact[]
) {
    const supabase = await createClient();

    for (const message of messages) {
        // Only process text messages
        if (message.type !== 'text') {
            await sendHelpMessage(message.from);
            continue;
        }

        const senderPhone = message.from;
        const senderHash = hashPhoneNumber(`+${senderPhone}`);
        const messageText = message.text?.body || '';

        // Check if sender is allowlisted
        const { data: recipient } = await supabase
            .from('whatsapp_recipients')
            .select('*')
            .eq('phone_hash', senderHash)
            .eq('active', true)
            .single();

        if (!recipient) {
            // Silent drop for unknown senders - logged but no response
            console.warn(`[WhatsApp] Unknown sender: ${senderHash.substring(0, 8)}...`);

            await supabase.from('whatsapp_interactions').insert({
                sender_hash: senderHash,
                command: 'unknown_sender',
                raw_message_sanitized: messageText.substring(0, 50),
                action_taken: 'unauthorized',
                outcome: 'unauthorized',
                received_at: new Date().toISOString()
            });

            continue;
        }

        // Check inbound rate limit
        const { data: withinLimit } = await supabase.rpc('check_whatsapp_rate_limit', {
            p_recipient_hash: senderHash,
            p_direction: 'inbound',
            p_limit: 50
        });

        if (!withinLimit) {
            await sendRateLimitMessage(senderPhone);

            await supabase.from('whatsapp_interactions').insert({
                sender_hash: senderHash,
                command: 'rate_limited',
                raw_message_sanitized: messageText.substring(0, 50),
                action_taken: 'invalid',
                outcome: 'rate_limited',
                received_at: new Date().toISOString()
            });

            continue;
        }

        // Increment rate limit
        await supabase.rpc('increment_whatsapp_rate_limit', {
            p_recipient_hash: senderHash,
            p_direction: 'inbound'
        });

        // Parse command
        const command = parseCommand(messageText);

        // Check permissions
        if (command.action !== 'invalid' && !canPerformAction(recipient.role as keyof typeof PERMISSIONS, command.action)) {
            await sendUnauthorizedMessage(senderPhone);

            await supabase.from('whatsapp_interactions').insert({
                sender_hash: senderHash,
                command: command.action,
                raw_message_sanitized: messageText.substring(0, 50),
                action_taken: command.action,
                outcome: 'unauthorized',
                received_at: new Date().toISOString()
            });

            continue;
        }

        // Process command
        switch (command.action) {
            case 'approve':
            case 'reject':
                const result = await processApprovalCommand(senderHash, command, supabase);
                if (result.success) {
                    await sendConfirmationMessage(senderPhone, command.action, command.queueId!);
                } else {
                    await sendErrorMessage(senderPhone, result.message);
                }
                break;

            case 'details':
                await handleDetailsCommand(senderPhone, command.queueId!, supabase);
                break;

            case 'status':
                await handleStatusCommand(senderPhone, senderHash, supabase);
                break;

            case 'invalid':
            default:
                await sendHelpMessage(senderPhone);

                await supabase.from('whatsapp_interactions').insert({
                    sender_hash: senderHash,
                    command: 'invalid',
                    raw_message_sanitized: messageText.substring(0, 50),
                    action_taken: 'invalid',
                    outcome: 'invalid_command',
                    received_at: new Date().toISOString()
                });
        }
    }
}

/**
 * Handle DETAILS command
 */
async function handleDetailsCommand(
    recipientPhone: string,
    queueId: string,
    supabase: Awaited<ReturnType<typeof createClient>>
) {
    const { data: queueItem } = await supabase
        .from('approval_queue')
        .select('*, policy_updates(*)')
        .eq('id', queueId)
        .single();

    if (!queueItem) {
        await sendErrorMessage(recipientPhone, 'Queue item not found');
        return;
    }

    // Send details message (simplified for now)
    await sendTextMessage(
        recipientPhone,
        `📋 ITEM DETAILS\n\n` +
        `Queue ID: ${queueId}\n` +
        `Status: ${queueItem.status}\n` +
        `Priority: ${queueItem.priority}\n` +
        `Created: ${new Date(queueItem.created_at).toISOString()}\n\n` +
        `View full details in Dashboard.`
    );
}

/**
 * Handle STATUS command
 */
async function handleStatusCommand(
    recipientPhone: string,
    senderHash: string,
    supabase: Awaited<ReturnType<typeof createClient>>
) {
    const { data: pendingItems, count } = await supabase
        .from('approval_queue')
        .select('*', { count: 'exact', head: false })
        .eq('status', 'pending')
        .limit(5);

    let statusText = `📊 QUEUE STATUS\n\n`;
    statusText += `Pending items: ${count || 0}\n\n`;

    if (pendingItems && pendingItems.length > 0) {
        statusText += `Recent:\n`;
        for (const item of pendingItems.slice(0, 3)) {
            statusText += `• ${item.id.substring(0, 8)}... (${item.priority})\n`;
        }
    }

    statusText += `\nView all in Dashboard.`;

    await sendTextMessage(recipientPhone, statusText);

    await supabase.from('whatsapp_interactions').insert({
        sender_hash: senderHash,
        command: 'status',
        action_taken: 'status',
        outcome: 'success',
        received_at: new Date().toISOString(),
        processed_at: new Date().toISOString()
    });
}

// Helper functions for sending messages
async function sendTextMessage(recipientPhone: string, text: string) {
    const phoneId = process.env.META_WHATSAPP_PHONE_ID;
    const token = process.env.META_WHATSAPP_ACCESS_TOKEN;

    await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: recipientPhone,
            type: 'text',
            text: { body: text }
        })
    });
}

async function sendHelpMessage(recipientPhone: string) {
    await sendTextMessage(
        recipientPhone,
        `❓ UNRECOGNIZED COMMAND\n\n` +
        `Valid commands:\n` +
        `• APPROVE [Queue ID]\n` +
        `• REJECT [Queue ID]\n` +
        `• DETAILS [Queue ID]\n` +
        `• STATUS\n\n` +
        `For all other actions, use the Dashboard.`
    );
}

async function sendConfirmationMessage(
    recipientPhone: string,
    action: string,
    queueId: string
) {
    const emoji = action === 'approve' ? '✅' : '🔴';
    const verb = action === 'approve' ? 'APPROVED' : 'REJECTED';

    await sendTextMessage(
        recipientPhone,
        `${emoji} ${verb}\n\n` +
        `Queue ID: ${queueId}\n` +
        `Logged to audit trail.`
    );
}

async function sendErrorMessage(recipientPhone: string, message: string) {
    await sendTextMessage(
        recipientPhone,
        `⚠️ ERROR\n\n${message}\n\nPlease try again or use the Dashboard.`
    );
}

async function sendRateLimitMessage(recipientPhone: string) {
    await sendTextMessage(
        recipientPhone,
        `⚠️ RATE LIMIT\n\n` +
        `You have reached the maximum number of commands for this period.\n\n` +
        `Please use the Dashboard for further actions.`
    );
}

async function sendUnauthorizedMessage(recipientPhone: string) {
    await sendTextMessage(
        recipientPhone,
        `🔒 UNAUTHORIZED\n\n` +
        `You do not have permission to perform this action.\n\n` +
        `Contact an administrator if you believe this is an error.`
    );
}

// Type definitions for webhook payload
interface WebhookPayload {
    object: string;
    entry: WebhookEntry[];
}

interface WebhookEntry {
    id: string;
    changes: WebhookChange[];
}

interface WebhookChange {
    field: string;
    value: WebhookValue;
}

interface WebhookValue {
    messaging_product: string;
    metadata: { display_phone_number: string; phone_number_id: string };
    contacts?: Contact[];
    messages?: IncomingMessage[];
    statuses?: StatusUpdate[];
}

interface Contact {
    profile: { name: string };
    wa_id: string;
}

interface IncomingMessage {
    from: string;
    id: string;
    timestamp: string;
    type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'location' | 'contacts' | 'interactive' | 'button';
    text?: { body: string };
    interactive?: { type: string; button_reply?: { id: string; title: string } };
}

interface StatusUpdate {
    id: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
    recipient_id: string;
    errors?: { code: number; title: string; message: string }[];
}
