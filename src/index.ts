import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectToWhatsApp } from './socket';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all origins for dev
        methods: ["GET", "POST"]
    }
});

const port = 3001;

async function main() {
    console.log('Starting Personal WhatsApp AI Assistant Backend...');

    // Connect to WhatsApp and pass the Socket.IO instance
    await connectToWhatsApp(io);

    httpServer.listen(port, () => {
        console.log(`Backend server running on http://localhost:${port}`);
    });
}

main().catch(err => console.error('Details:', err));
