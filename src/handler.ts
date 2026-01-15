import { WAMessage, WASocket, proto } from '@whiskeysockets/baileys';
import { generateResult } from './ai';

export async function handleUpsert(sock: WASocket, messages: WAMessage[]) {
    for (const msg of messages) {
        // console.log('Received message:', JSON.stringify(msg, null, 2));

        if (!msg.message) continue;

        // Ignore messages from self
        if (msg.key.fromMe) continue;

        // Ignore status updates
        if (msg.key.remoteJid === 'status@broadcast') continue;

        // Determine message type and content
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (!text) {
            // console.log('Non-text message received, skipping.');
            continue;
        }

        const sender = msg.pushName || msg.key.remoteJid || 'Unknown';
        const jid = msg.key.remoteJid!;

        console.log(`[Message] From ${sender} (${jid}): ${text}`);

        // Generate AI Reply
        const replyText = await generateResult(text, sender);
        console.log(`[Reply] Sending: ${replyText}`);

        // Send Reply
        // Simulate typing presence
        await sock.sendPresenceUpdate('composing', jid);

        // Wait a bit to make it natural (and allow presence to be seen)
        await new Promise(r => setTimeout(r, 2000));

        await sock.sendMessage(jid, { text: replyText }, { quoted: msg });

        await sock.sendPresenceUpdate('paused', jid);
    }
}
