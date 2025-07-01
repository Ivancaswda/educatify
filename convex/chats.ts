/*
import {v} from 'convex/values'
import {mutation, query} from "./_generated/server";
import {Id} from './_generated/dataModel'
import {StreamChat} from "stream-chat";

// Создать чат между двумя участниками
export const createOrGetChat = mutation({
    args: { participantIds: v.array(v.string()) },
    handler: async (ctx, args) => {
        const sortedIds = [...args.participantIds].sort();
        const existing = await ctx.db
            .query("chats")
            .collect();

        const chat = existing.find((chat) =>
            JSON.stringify(chat.participantIds.sort()) === JSON.stringify(sortedIds)
        );

        if (chat) return chat._id;

        const chatId: Id<"chats"> = await ctx.db.insert("chats", {
            participantIds: sortedIds,
            createdAt: Date.now()
        });

        return chatId;
    }
});

export const getUserChats = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const allChats = await ctx.db.query('chats').collect();

        return allChats.filter(chat => chat.participantIds.includes(args.userId));
    }
});

export const sendMessage = mutation({
    args: {
        chatId: v.id("chats"),
        senderId: v.string(),
        text: v.string(),
        imageUrl: v.optional(v.string()), // если сообщение с фото
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("messages", {
            chatId: args.chatId,
            senderId: args.senderId,
            text: args.text,
            imageUrl: args.imageUrl,
            createdAt: Date.now(),
        });
    },
});

export const getMessages = query({
    args: { chatId: v.id("chats") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages").withIndex('by_chat_id', (q) => q.eq("chatId", args.chatId)).collect()
    },
});
*/
