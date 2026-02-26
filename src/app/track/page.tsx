"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function TrackPage() {
    const router = useRouter();
    const [trackingId, setTrackingId] = useState("");
    const [recentSearches] = useState(["583941720468", "907316482159", "214785903624"]);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingId.trim()) {
            router.push(`/track/${encodeURIComponent(trackingId.trim())}`);
        }
    };

    const handleQuickTrack = (id: string) => {
        router.push(`/track/${encodeURIComponent(id)}`);
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
            <div className="absolute bottom-40 left-10 w-64 h-64 bg-yellow-400/8 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-yellow-400/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-black/5" />

            {/* Floating dots */}
            <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-32 right-1/4 w-4 h-4 bg-yellow-400 rounded-full"
            />
            <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-48 left-1/3 w-3 h-3 bg-black rounded-full opacity-20"
            />
            <motion.div
                animate={{ y: [-6, 12, -6] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 right-16 w-5 h-5 bg-yellow-400/40 rounded-full"
            />
            <motion.div
                animate={{ y: [5, -10, 5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-40 left-20 w-2 h-2 bg-yellow-400 rounded-full"
            />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
                {/* Animated Icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                    className="mb-8"
                >
                    <div className="relative">
                        <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        {/* Pulse rings */}
                        <motion.div
                            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            className="absolute inset-0 w-20 h-20 bg-yellow-400 rounded-full"
                        />
                        <motion.div
                            animate={{ scale: [1, 2], opacity: [0.2, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                            className="absolute inset-0 w-20 h-20 bg-yellow-400 rounded-full"
                        />
                    </div>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl lg:text-5xl font-bold text-black">
                        Track your shipment<span className="text-yellow-400">.</span>
                    </h1>
                    <p className="text-black/40 mt-3 max-w-md mx-auto">
                        Enter your tracking ID below to get real-time updates on your parcel&apos;s journey.
                    </p>
                </motion.div>

                {/* Search Form */}
                <motion.form
                    onSubmit={handleTrack}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="w-full max-w-xl"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 via-yellow-400/10 to-yellow-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-white rounded-2xl border border-black/10 shadow-lg shadow-black/5 p-2 flex gap-2">
                            <div className="relative flex-1">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    placeholder="Enter tracking ID (e.g. 583941720468)"
                                    className="w-full pl-12 pr-4 py-4 bg-transparent text-black placeholder:text-black/30 focus:outline-none text-lg"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-8 py-4 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 active:scale-95 whitespace-nowrap"
                            >
                                Track
                            </button>
                        </div>
                    </div>
                </motion.form>

                {/* Quick Track / Recent */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-8 text-center"
                >
                    <p className="text-xs text-black/30 mb-3">Try a sample tracking ID</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                        {recentSearches.map((id) => (
                            <button
                                key={id}
                                onClick={() => handleQuickTrack(id)}
                                className="px-4 py-2 bg-black/[0.03] border border-black/5 rounded-full text-sm font-mono text-black/50 hover:bg-yellow-400/10 hover:border-yellow-400/30 hover:text-black transition-all duration-200"
                            >
                                {id}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Info Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-16 grid sm:grid-cols-3 gap-6 w-full max-w-3xl"
                >
                    {[
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            ),
                            title: "Real-Time Updates",
                            desc: "Status changes are reflected instantly as your parcel moves.",
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            ),
                            title: "Route Visibility",
                            desc: "See origin, destination, and every checkpoint along the way.",
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            ),
                            title: "No Login Required",
                            desc: "Track any shipment publicly with just the tracking ID.",
                        },
                    ].map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                            className="card text-center group"
                        >
                            <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-yellow-500 group-hover:bg-yellow-400/20 transition-colors">
                                {card.icon}
                            </div>
                            <h3 className="font-semibold text-black text-sm">{card.title}</h3>
                            <p className="text-xs text-black/40 mt-1">{card.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
