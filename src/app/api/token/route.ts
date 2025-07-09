import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';

const serverClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_SECRET_KEY!
);

export async function POST(req: Request) {
    const body = await req.json();
    const { userId, userName, userImage, mentorId, mentorName, mentorImage } = body;
    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Создаём user, если не существует
    await serverClient.upsertUsers([
        { id: userId, name: userName, image: userImage },
        { id: mentorId, name: mentorName, image: mentorImage }
    ]);
    const token = serverClient.createToken(userId);
    console.log(token)
    return NextResponse.json({ token });
}