'use client';

import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import LoaderUI from "@/components/LoaderUI";
import {SignIn} from "@clerk/nextjs";
import SignInPage from "@/app/(auth)/sign-in/[[...sign-in]]/page";
import {useRouter} from "next/navigation";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export const StreamChatProvider = ({
                                       user,
                                       token,
                                       children,
                                       onNewMessage
                                   }: {
    user: { id: string; name: string; image?: string };
    token: string;
    children: React.ReactNode;
    onNewMessage?: (message: any) => void;
}) => {
    const [chatClient, setChatClient] = useState<StreamChat | null>(null);

    useEffect(() => {
        const client = new StreamChat(apiKey);

        const connect = async () => {
            try {
                await client.connectUser(user, token);
                setChatClient(client);
            } catch (e) {
                console.error("Ошибка подключения StreamChat:", e);
            }
        };

        connect();

        return () => {
            client.disconnectUser();
        };
    }, [user, token]);

    useEffect(() => {
        if (!chatClient) return;

        const handleNewMessage = (event: any) => {
            if (onNewMessage) onNewMessage(event.message);
        };

        chatClient.on("message.new", handleNewMessage);
        return () => {
            chatClient.off("message.new", handleNewMessage);
        };
    }, [chatClient]);

    if (!chatClient) {
        return <LoaderUI />;
    }

    return <Chat client={chatClient}>{children}</Chat>;
};
