import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
    ...authTables,

    // We can extend the 'users' table or keep our own and link them.
    // Standard Convex Auth uses 'users' table by default.
    // We will merge our schema into it.
    users: defineTable({
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        image: v.optional(v.string()),
        token: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
    }).index("email", ["email"]),

    chats: defineTable({
        jid: v.string(), // WhatsApp JID
        name: v.string(),
        lastMessage: v.string(),
        time: v.string(),
        unread: v.number(),
        aiActive: v.boolean(),
        updatedAt: v.number(),
    }).index("by_jid", ["jid"]),

    messages: defineTable({
        chatJid: v.string(),
        sender: v.string(), // 'me' | 'contact' | 'ai'
        text: v.string(),
        timestamp: v.number(),
        status: v.string(), // 'sent' | 'read'
    }).index("by_chat", ["chatJid"]),
});
