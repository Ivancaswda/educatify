'use server'

import {currentUser} from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";
import {useAuth} from "@/providers/authContext";


export const streamTokenProvider = async (userId: string): Promise<string> => {




    if (!userId) throw new Error("User not authenticated");



    const streamClient = new StreamClient(
        process.env.NEXT_PUBLIC_STREAM_API_KEY!,
        process.env.STREAM_SECRET_KEY!
    );

    const token = streamClient.generateUserToken({ user_id: userId });

    console.log(token)
    return token; //  тип string
};
