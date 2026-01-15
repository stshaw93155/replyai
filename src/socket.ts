import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    WASocket,
    makeCacheableSignalKeyStore,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import { Server } from 'socket.io';
import { handleUpsert } from './handler';
import { ConvexHttpClient } from "convex/browser";
import { api } from "../whats-app-ai-assistant/convex/_generated/api.js";
import dotenv from 'dotenv';

dotenv.config();

// Define the logger
const logger = pino({ level: 'silent' });

// Initialize Convex Client
const convexConfig = process.env.CONVEX_URL;
let convex: ConvexHttpClient | null = null;
if (convexConfig) {
    convex = new ConvexHttpClient(convexConfig);
    console.log("Convex Client initialized with:", convexConfig);
} else {
    console.warn("CONVEX_URL not found in .env, persistent storage disabled.");
}

export async function connectToWhatsApp(io: Server) {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version, isLatest } = await fetchLatestBaileysVersion();

    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        generateHighQualityLinkPreview: true,
    });

    // Store latest state to send to new clients
    let currentQR: string | undefined;
    let currentConnectionState: string = 'close';

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) currentQR = qr;
        if (connection) currentConnectionState = connection;

        // Emit connection update to frontend via Socket.IO (still used for QR display)
        io.emit('connection.update', { connection, qr });

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                setTimeout(() => connectToWhatsApp(io), 2000);
            }
        } else if (connection === 'open') {
            console.log('opened connection');
            currentQR = undefined;
            // Clear QR code on frontend
            io.emit('connection.update', { connection: 'open', qr: undefined });
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        // Emit new messages to frontend via Socket.IO (optional fallback)
        io.emit('message.upsert', m);

        // Push to Convex
        if (convex) {
            try {
                const messages = m.messages;
                for (const msg of messages) {
                    if (!msg.message) continue;
                    const jid = msg.key.remoteJid;
                    if (!jid || jid === 'status@broadcast') continue;

                    const isMe = msg.key.fromMe || false;
                    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
                    const sender = isMe ? 'me' : 'contact';
                    const pushName = msg.pushName || jid.split('@')[0];

                    if (text) {
                        await convex.mutation(api.chats.syncMessage, {
                            jid: jid,
                            chatName: pushName,
                            sender: sender,
                            text: text,
                            timestamp: (typeof msg.messageTimestamp === 'number' ? msg.messageTimestamp : (msg.messageTimestamp as any)?.low || 0) * 1000 || Date.now(),
                            isMe: isMe
                        });
                    }
                }
            } catch (e) {
                console.error("Error syncing to Convex:", e);
            }
        }

        await handleUpsert(sock, m.messages);
    });

    io.on('connection', (socket) => {
        console.log('Frontend connected to Socket.IO:', socket.id);

        socket.emit('connection.update', {
            connection: currentConnectionState,
            qr: currentQR
        });

        socket.on('sendMessage', async (data) => {
            const { jid, text } = data;
            console.log(`Sending message via Socket.IO to ${jid}: ${text}`);
            if (sock) {
                await sock.sendMessage(jid, { text });
            }
        });
    });

    return sock;
}
