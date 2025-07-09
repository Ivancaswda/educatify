'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import {api} from "../../convex/_generated/api";
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatRoom = () => {
    const { id: chatId } = useParams();
    const { user } = useUser();

    const messages = useQuery(api.chats.getChatMessages, { chatId });
    const sendMessage = useMutation(api.chats.sendMessage);

    const [text, setText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
        if (!text.trim()) return;

        await sendMessage({
            chatId,
            senderId: user?.id!,
            text,
        });

        setText('');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="flex-1 overflow-y-auto p-4">
                {messages?.map((msg) => (
                    <div
                        key={msg._id}
                        className={`mb-2 p-2 rounded ${
                            msg.senderId === user?.id ? 'bg-blue-100 self-end' : 'bg-gray-100'
                        }`}
                    >
                        {msg.text}
                        {msg.imageUrl && (
                            <img src={msg.imageUrl} alt="sent pic" className="mt-1 max-w-xs rounded" />
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex p-2 border-t">
                <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Напишите сообщение..."
                    className="flex-1"
                />
                <Button onClick={handleSend} className="ml-2">Отправить</Button>
            </div>
        </div>
    );
};

export default ChatRoom;