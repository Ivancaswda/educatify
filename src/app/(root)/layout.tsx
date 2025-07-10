"use client";

import StreamClientProvider from "@/providers/StreamClientProvider";
import Navbar from "@/components/Navbar";
import { StreamChatProvider } from "@/providers/StreamProvider";
import { useEffect, useState } from "react";
import LoaderUI from "@/components/LoaderUI";
import {usePathname, useRouter} from "next/navigation";
import { useAuth } from "@/providers/authContext";
import {jwtDecode} from "jwt-decode";
import {api} from "../../../convex/_generated/api";
import {useQuery} from "convex/react";

function Layout({ children }: { children: React.ReactNode }) {
    const { token, isLoading, user } = useAuth();
    const pathname = usePathname()
    const router = useRouter();
    const [streamToken, setStreamToken] = useState<string | null>(null);

    console.log(token)
    console.log(user)


    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/sign-in");
        }
    }, [user, isLoading, router]);




    useEffect(() => {

        if (!token || typeof token !== "string") {
            console.warn("Invalid token, skipping effect");
            return;
        }

        const decoded: any = jwtDecode(token)


        console.log(decoded)
        const userId = decoded.id || decoded.sub;

        console.log("Using userId for Stream:", userId);
        const fetchStreamToken = async () => {
            const res = await fetch("/api/getToken", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (!res.ok) {
                console.error("Failed to fetch stream token");
                return;
            }

            const data = await res.json();
            console.log("Stream token received:", data.token);
            setStreamToken(data.token);
        };

        fetchStreamToken();
    }, [token]);


    if (!token) return;
    if (pathname !== '/blog') {
        if (isLoading || !token || !streamToken ) {
            return <LoaderUI />;
        }
    }

    const decoded: any = jwtDecode(token)

    const chatUser = {
        id: decoded.id || decoded.sub,
        name: decoded.name || "unknown",
        image: decoded.image || "",
    };



    return (
        <StreamClientProvider>
            <StreamChatProvider
                user={chatUser}
                token={streamToken} // Вот сюда передаём именно Stream токен!
                onNewMessage={(msg) => {
                    console.log("🔔 Получено сообщение в Layout:", msg);
                }}
            >
                <Navbar />
                {children}
            </StreamChatProvider>
        </StreamClientProvider>
    );
}

export default Layout;
