"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import SupportBubble from "./SupportBubble";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard");

    return (
        <>
            {!isDashboard && <Header />}
            <main className={isDashboard ? "" : "pt-[72px]"}>{children}</main>
            {!isDashboard && <Footer />}
            {!isDashboard && <SupportBubble />}
        </>
    );
}
