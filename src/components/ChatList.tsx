'use client'
import React from 'react';
import { useQuery } from 'convex/react';
import {api} from "../../convex/_generated/api";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import LoaderUI from "@/components/LoaderUI";

const ChatsList = () => {
    const { user } = useUser();
    const router = useRouter();

    const chats = useQuery(api.chats.getUserChats, { userId: user?.id || '' });
    console.log(chats)
    if (!chats) return <LoaderUI/>;

    return (
        <div className="p-4">
            <h2 className="text-xl  font-bold mb-4">Ваши чаты</h2>
            {chats.map((chat) => (
                <div
                    key={chat._id}
                    onClick={() => router.push(`/chats/${chat._id}`)}
                    className="cursor-pointer p-2 border rounded mb-2 hover:bg-gray-100"
                >
                    Чат с: {chat.participantIds}
                </div>
            ))}
        </div>
    );
};

export default ChatsList;