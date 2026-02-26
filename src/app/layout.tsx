import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import BackgroundBubbles from "@/components/BackgroundBubbles";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata: Metadata = {
    title: "Shipswipe Logistics — Modern B2B Shipping & Tracking",
    description:
        "Track your shipments in real-time with Shipswipe Logistics. Reliable B2B freight and parcel delivery across USA and Canada.",
    icons: {
        icon: "/favicon.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <Providers>
                    <BackgroundBubbles />
                    <ConditionalLayout>{children}</ConditionalLayout>
                </Providers>
            </body>
        </html>
    );
}
