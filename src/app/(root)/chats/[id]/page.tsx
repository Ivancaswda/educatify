'use client';
import { createHash } from 'crypto';
import { useUser } from '@clerk/nextjs';
import {useParams, useRouter} from 'next/navigation';
import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
    Chat,
    Channel,
    ChannelHeader,
    ChannelList,
    MessageInput,
    MessageList,
    Thread,
    Window,
    useChannelStateContext
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import LoaderUI from '@/components/LoaderUI';
import {useQuery} from "convex/react";
import {api} from "../../../../../convex/_generated/api";
import {ArrowLeftCircle} from "lucide-react";
import {useAuth} from "@/providers/authContext";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const client = StreamChat.getInstance(apiKey);

export default function ChatWithMentorPage() {
    const { user } = useAuth();
    const { id: mentorId } = useParams(); // 👈 получаем mentorId из URL
    const [channel, setChannel] = useState(null);
    const [channelClient, setChannelClient] = useState(null)
    const users = useQuery(api.users.getUsers) ?? []
    const me = users.find((u) => u._id === user.id || u.userId === user.user_id)
    const [loading, setLoading] = useState(false);

    const mentor = users.find((u) => u.userId === mentorId || u._id === mentorId)
    const {thread} = useChannelStateContext()
    useEffect(() => {
        if (!user || !mentor) return;

        const initChat = async () => {
            try {

                const res = await fetch('/api/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: me.userId,
                        userName: user.name || 'No name',
                        userImage: user.image,
                        mentorId: mentor.userId,
                        mentorName: mentor.name, // <-- можно получить из базы данных
                        mentorImage: mentor.image
                    }),
                });
                console.log(res)
                const { token } = await res.json();
                console.log(token)
                await client.connectUser(
                    {
                        id: me.userId,
                        name: user.name || 'No name',
                        image: user?.image,
                    },
                    token
                );
                const sortedIds = [me.userId, mentorId].sort();
                const rawId = sortedIds.join('-');
                const channelId = createHash('sha256').update(rawId).digest('hex').slice(0, 30); // <= максимум 64 символа
                console.log(channelId.length)
                console.log(mentorId)
                console.log(user)
                const channel = client.channel('messaging', channelId, {
                    members: [me.userId, mentor.userId],
                });


                try {
                    await channel.query(); // проверить, существует ли
                } catch (e) {
                    // Канала нет — создаём
                    await channel.create();
                }
                await channel.watch();
                setChannel(channel);


            } catch (err) {
                console.error('Ошибка подключения:', err);
            }
        };

        initChat();

        return () => {
            // вызываем disconnectUser
            if (client?.user) {
                client.disconnectUser();
            }
        };
    }, [user, mentorId, users]);

    if (!channel) return <LoaderUI />;
    const router = useRouter()
    return (
        <Chat client={client} theme="messaging light">
            <Channel channel={channel}>
                <Window>
                    <ArrowLeftCircle className='cursor-pointer mb-2 ml-2' onClick={() => router.push('/chats')} />
                    <ChannelHeader/>
                    <MessageList />
                    <MessageInput focus />

                </Window>

                {thread && <Thread />}
            </Channel>
        </Chat>
    );
}
