import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getChats = query({
    args: {},
    handler: async (ctx) => {
        const chats = await ctx.db.query("chats").order("desc").collect();
        // Sort manually by updatedAt if index sort isn't sufficient (Convex sorts by _creationTime by default if not specified, but we want updatedAt)
        // Actually, let's just return them, frontend can sort or we sort here
        return chats.sort((a, b) => b.updatedAt - a.updatedAt);
    },
});

export const getMessages = query({
    args: { chatId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .withIndex("by_chat", (q) => q.eq("chatJid", args.chatId))
            .order("asc") // Oldest first for chat history
            .take(100); // Limit for performance
    },
});

export const syncMessage = mutation({
    args: {
        jid: v.string(),
        chatName: v.string(),
        sender: v.string(),
        text: v.string(),
        timestamp: v.number(),
        isMe: v.boolean(),
    },
    handler: async (ctx, args) => {
        // 1. Update or Create Chat
        const existingChat = await ctx.db
            .query("chats")
            .withIndex("by_jid", (q) => q.eq("jid", args.jid))
            .first();

        if (existingChat) {
            await ctx.db.patch(existingChat._id, {
                lastMessage: args.text,
                time: new Date(args.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                updatedAt: args.timestamp,
                unread: (!args.isMe && existingChat.jid !== args.jid) ? existingChat.unread + 1 : existingChat.unread, // Simple unread logic, refined on frontend open
            });
        } else {
            await ctx.db.insert("chats", {
                jid: args.jid,
                name: args.chatName,
                lastMessage: args.text,
                time: new Date(args.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unread: args.isMe ? 0 : 1,
                aiActive: true,
                updatedAt: args.timestamp,
            });
        }

        // 2. Insert Message
        await ctx.db.insert("messages", {
            chatJid: args.jid,
            sender: args.sender,
            text: args.text,
            timestamp: args.timestamp,
            status: 'sent',
        });
    },
});

export const markRead = mutation({
    args: { jid: v.string() },
    handler: async (ctx, args) => {
        const chat = await ctx.db.query("chats").withIndex("by_jid", q => q.eq("jid", args.jid)).first();
        if (chat) {
            await ctx.db.patch(chat._id, { unread: 0 });
        }
    }
});
