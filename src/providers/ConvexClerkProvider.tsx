"use client";

import {ConvexProvider, ConvexReactClient} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {AuthProvider} from "@/providers/authContext";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
    const locale = typeof window !== "undefined" ? navigator.language.split("-")[0] : "ru";
    return (
        <AuthProvider>
            <ConvexProvider client={convex}  >
                {children}
            </ConvexProvider>
        </AuthProvider>
    );
}

export default ConvexClerkProvider;