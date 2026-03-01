"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SupportBubble() {
    const [open, setOpen] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [hasNewReply, setHasNewReply] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/api/support")
            .then((r) => r.json())
            .then((d) => setWhatsappNumber(d.whatsappNumber || ""))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (open) setHasNewReply(false);
    }, [open]);

    const handleSend = () => {
        const text = inputValue.trim();
        if (!text) return;
        setInputValue("");
        setMessages((prev) => [...prev, { from: "user", text }]);

        // Auto-reply after a short delay
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    from: "bot",
                    text: "We're currently migrating our systems. Live support is available on WhatsApp for the moment. Tap the button below to reach us!",
                },
            ]);
            if (!open) setHasNewReply(true);
        }, 800);
    };

    const whatsappUrl = whatsappNumber
        ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`
        : "#";

    return (
        <>
            {/* Floating Bubble */}
            <motion.button
                onClick={() => setOpen((v) => !v)}
                className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-400/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Open support chat"
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.svg
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-6 h-6 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </motion.svg>
                    ) : (
                        <motion.svg
                            key="chat"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-6 h-6 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </motion.svg>
                    )}
                </AnimatePresence>

                {/* Notification dot */}
                {hasNewReply && !open && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}

                {/* Pulse ring when closed */}
                {!open && (
                    <span className="absolute inset-0 rounded-full bg-yellow-400/40 animate-ping pointer-events-none" />
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.92 }}
                        transition={{ type: "spring", damping: 24, stiffness: 300 }}
                        className="fixed bottom-24 right-6 z-[9999] w-[340px] max-h-[480px] bg-white rounded-2xl shadow-2xl shadow-black/15 border border-black/[0.06] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-black to-neutral-800 px-5 py-4 flex items-center gap-3 flex-shrink-0">
                            <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-sm">Support</p>
                                <p className="text-white/50 text-[11px]">We typically reply instantly</p>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-white/40 hover:text-white transition-colors p-1"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 180, maxHeight: 260 }}>
                            {/* Default welcome */}
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center py-6">
                                    <div className="w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-black/70">Hi there! 👋</p>
                                    <p className="text-xs text-black/40 mt-1 leading-relaxed max-w-[220px]">
                                        We&apos;re migrating our systems. Live support is on WhatsApp for now.
                                    </p>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                                            msg.from === "user"
                                                ? "bg-yellow-400 text-black rounded-br-md"
                                                : "bg-black/[0.04] text-black/80 rounded-bl-md"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* WhatsApp CTA */}
                        <div className="px-4 pb-2">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm rounded-xl transition-all duration-200 active:scale-[0.97] shadow-sm shadow-green-500/20"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                Continue on WhatsApp
                            </a>
                        </div>

                        {/* Input — disabled with migration note */}
                        <div className="px-4 pb-4 pt-1">
                            <div className="flex items-center gap-2 bg-black/[0.03] rounded-xl border border-black/[0.06] px-3 py-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent text-sm text-black/70 placeholder:text-black/25 outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim()}
                                    className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center hover:bg-yellow-300 transition-colors disabled:opacity-30 disabled:hover:bg-yellow-400 flex-shrink-0"
                                >
                                    <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
