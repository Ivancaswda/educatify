// lib/stream.ts (клиент)
import { StreamChat } from "stream-chat";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
export const chatClient = StreamChat.getInstance(apiKey);




export async function connectUser(user, token) {
    await chatClient.connectUser(user, token);
}

// Пример создания канала
export const createChannel = async (userId1: string, userId2: string) => {
    const channel = chatClient.channel('messaging', {
        members: [userId1, userId2],
    });

    await channel.create();
};

export async function disconnectUser() {
    await chatClient.disconnectUser();
}

