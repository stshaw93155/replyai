import { mutation } from "./_generated/server";

export const seedData = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Create a sample user
        const existingUser = await ctx.db.query("users").filter(q => q.eq(q.field("email"), "demo@example.com")).first();
        if (!existingUser) {
            await ctx.db.insert("users", {
                name: "Demo User",
                email: "demo@example.com",
                createdAt: Date.now(),
            });
        }

        // 2. Create a sample chat
        const existingChat = await ctx.db.query("chats").filter(q => q.eq(q.field("jid"), "1234567890@s.whatsapp.net")).first();
        let chatId;
        if (!existingChat) {
            chatId = await ctx.db.insert("chats", {
                jid: "1234567890@s.whatsapp.net",
                name: "Alice (Demo)",
                lastMessage: "Hey, can you help me with this?",
                time: "10:30 AM",
                unread: 2,
                aiActive: true,
                updatedAt: Date.now(),
            });
        } else {
            chatId = existingChat._id;
        }

        // 3. Create sample messages for that chat
        const messages = await ctx.db.query("messages").filter(q => q.eq(q.field("chatJid"), "1234567890@s.whatsapp.net")).collect();
        if (messages.length === 0) {
            await ctx.db.insert("messages", {
                chatJid: "1234567890@s.whatsapp.net",
                sender: "contact",
                text: "Hello!",
                timestamp: Date.now() - 100000,
                status: "read",
            });
            await ctx.db.insert("messages", {
                chatJid: "1234567890@s.whatsapp.net",
                sender: "me",
                text: "Hi Alice, how's it going?",
                timestamp: Date.now() - 50000,
                status: "read",
            });
            await ctx.db.insert("messages", {
                chatJid: "1234567890@s.whatsapp.net",
                sender: "contact",
                text: "Hey, can you help me with this?",
                timestamp: Date.now(),
                status: "read",
            });
        }
    },
});
