'use client'

import React, {ReactNode, useEffect, useState } from 'react'

import {StreamVideoClient, StreamVideo} from "@stream-io/video-react-sdk";

import {Loader2Icon} from "lucide-react";

import LoaderUI from "@/components/LoaderUI";
import {streamTokenProvider} from "@/actions/stream.actions";
import SignInPage from "@/app/(auth)/sign-in/[[...sign-in]]/page";
import {useRouter} from "next/navigation";
import {useAuth} from "@/providers/authContext";




const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient>()

    const {user} = useAuth()



    useEffect(() => {
        if (!user) return;

        const init = async () => {
            const token = await streamTokenProvider(user.id ?? user?.user_id ); //user.id
            console.log(token)
            const client = new StreamVideoClient({
                apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
                user: {
                    id: user.id || user?.user_id ,
                    name: user.name || user.id,
                    image: user.image,
                },
                token,
            });
            console.log(client)

            setStreamVideoClient(client);
        };

        init();
    }, [user]);



    //if (!user) return <SignInPage/>




    if (!streamVideoClient) return <LoaderUI />
    return (
        <StreamVideo client={streamVideoClient}>
            {children}
        </StreamVideo>
    )
}
export default StreamVideoProvider
