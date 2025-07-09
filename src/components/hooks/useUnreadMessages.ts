// useUnreadMessages.ts
'use client';
import { useEffect, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import type { Channel, MessageResponse } from 'stream-chat';
import {useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {useAuth} from "@/providers/authContext";

interface UnreadMessageInfo {
    message: MessageResponse;
    channelId: string;
}

export function useUnreadMessages() {
    const { client } = useChatContext();
    console.log(client)
    const {user} = useAuth()
    const users = useQuery(api.users.getUsers)
    const me = users?.find((u) => u._id === user?.id)

    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState<UnreadMessageInfo[]>([]);

    const updateUnreadData = async () => {
        try {
            const channels = await client.queryChannels({
                members: { $in: [client.userID] },
            });
            console.log(channels)
            let totalUnread = 0;
            const unreadMsgs: UnreadMessageInfo[] = [];

            for (const channel of channels) {
                totalUnread += channel.countUnread();
                console.log(channel)
                const messages = channel.state.messages;
                console.log(messages)
                const lastRead = channel.state.read[client.userID]?.last_read;
                const lastReadTime = lastRead ? new Date(lastRead).getTime() : 0;

                const unreadMessagesInChannel = channel.state.messages.filter(msg => {
                    const createdAt = new Date(msg.created_at).getTime();
                    const isUnread = createdAt > lastReadTime;
                    const isFromOtherUser = msg.user?.id !== client.userID;
                    return isUnread && isFromOtherUser;
                });

                unreadMessagesInChannel.forEach(msg => {
                    unreadMsgs.push({ message: msg, channelId: channel.id });
                });
            }

            unreadMsgs.sort((a, b) => {
                const dateA = new Date(a.message.created_at).getTime();
                const dateB = new Date(b.message.created_at).getTime();
                return dateA - dateB;
            });

            setUnreadCount(totalUnread);
            setUnreadMessages(unreadMsgs);
        } catch (err) {
            console.error('Failed to fetch unread messages:', err);
        }
    };

    const clearUnreadMessages = async () => {
        try {
            const channels = await client.queryChannels({
                members: { $in: [client.userID] },
            });

            for (const channel of channels) {
                await channel.markRead();
            }

            setUnreadCount(0);
            setUnreadMessages([]);

            // ✅ Подождать, чтобы сервер успел обновить состояние
            await new Promise(resolve => setTimeout(resolve, 1000));

            await updateUnreadData(); // только после паузы
        } catch (err) {
            console.error('Ошибка при очистке уведомлений:', err);
        }
    };


    useEffect(() => {
        if (!client || !client.userID) return;

        updateUnreadData();

        const handleEvent = () => updateUnreadData();

        client.on('message.new', handleEvent);
        client.on('notification.message_new', handleEvent);
        client.on('notification.mark_read', handleEvent);
        client.on('message.read', handleEvent);

        return () => {
            client.off('message.new', handleEvent);
            client.off('notification.message_new', handleEvent);
            client.off('notification.mark_read', handleEvent);
            client.off('message.read', handleEvent);
        };
    }, [client]);

    return {
        unreadCount,
        unreadMessages,
        setUnreadCount,
        setUnreadMessages,
        refresh: updateUnreadData,
        clearUnreadMessages,
    };
}
