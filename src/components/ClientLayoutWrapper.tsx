// components/ClientLayoutWrapper.tsx — клиентский компонент с 'use client'
'use client';

import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";

    return (
        <ConvexClerkProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {/* GRID BACKGROUND */}
                <div className="fixed inset-0 -z-1">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(var(--cyber-grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-grid-color)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                </div>

                <main className={`${isAuthPage ? "" : "pt-24"} flex-grow flex flex-col`}>
                    {children}
                </main>

                {!isAuthPage && <Footer />}
            </ThemeProvider>

            <Toaster
                toastOptions={{
                    style: {
                        background: "#333",
                        color: "#fff",
                    },
                }}
            />
        </ConvexClerkProvider>
    );
}
