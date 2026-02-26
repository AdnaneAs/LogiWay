"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Dropdown config
const servicesMenu = [
    { href: "/login", label: "International Freight", desc: "Cross-border shipping solutions" },
    { href: "/login", label: "Domestic Delivery", desc: "Nationwide next-day delivery" },
    { href: "/login", label: "Last Mile", desc: "Final-mile fulfillment" },
];

const resourcesMenu = [
    { href: "/about#about", label: "About Us", desc: "Our story & values" },
    { href: "/about#case-studies", label: "Case Studies", desc: "Real B2B success stories" },
    { href: "/about#documentation", label: "Documentation", desc: "API & integration guides" },
    { href: "/login", label: "Blog", desc: "Industry insights & updates" },
];

function NavDropdown({
    label,
    items,
    open,
    onToggle,
}: {
    label: string;
    items: typeof servicesMenu;
    open: boolean;
    onToggle: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                if (open) onToggle();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, onToggle]);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={onToggle}
                className="text-sm font-medium text-black/60 hover:text-black transition-colors duration-200 flex items-center gap-1"
            >
                {label}
                <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl border border-black/5 shadow-xl shadow-black/5 overflow-hidden z-50"
                    >
                        <div className="p-2">
                            {items.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={onToggle}
                                    className="block px-4 py-3 rounded-xl hover:bg-yellow-400/5 transition-colors group"
                                >
                                    <p className="text-sm font-medium text-black group-hover:text-yellow-600 transition-colors">
                                        {item.label}
                                    </p>
                                    <p className="text-xs text-black/35 mt-0.5">{item.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Header() {
    const { data: session, status } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const isAdmin = session?.user?.role === "ADMIN";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="text-black font-bold text-lg">S</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full animate-pulse" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-black">
                        Shipswipe<span className="text-yellow-400">.</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-7">
                    <Link
                        href="/track"
                        className="text-sm font-medium text-black/60 hover:text-black transition-colors duration-200"
                    >
                        Track Shipment
                    </Link>

                    <NavDropdown
                        label="Services"
                        items={servicesMenu}
                        open={openDropdown === "services"}
                        onToggle={() => setOpenDropdown(openDropdown === "services" ? null : "services")}
                    />

                    <Link
                        href="/#fleet-section"
                        className="text-sm font-medium text-black/60 hover:text-black transition-colors duration-200"
                    >
                        Fleet
                    </Link>

                    <Link
                        href="/pricing"
                        className="text-sm font-medium text-black/60 hover:text-black transition-colors duration-200"
                    >
                        Pricing
                    </Link>

                    <NavDropdown
                        label="Resources"
                        items={resourcesMenu}
                        open={openDropdown === "resources"}
                        onToggle={() => setOpenDropdown(openDropdown === "resources" ? null : "resources")}
                    />

                    <Link
                        href="/#contact"
                        className="text-sm font-medium text-black/60 hover:text-black transition-colors duration-200"
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Auth Area */}
                <div className="hidden lg:flex items-center gap-3">
                    {status === "authenticated" ? (
                        <div className="flex items-center gap-3">
                            {isAdmin && (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-yellow-400 rounded-full hover:bg-yellow-300 transition-all duration-200 hover:shadow-md hover:shadow-yellow-400/20"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                    Dashboard
                                </Link>
                            )}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/[0.03] rounded-full">
                                <div className="w-6 h-6 bg-yellow-400/20 rounded-full flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-yellow-600">
                                        {session.user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-sm text-black/50 font-medium">{session.user?.name}</span>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="px-4 py-2 text-sm font-medium text-black/50 hover:text-black hover:bg-black/5 rounded-full transition-colors duration-200"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="px-5 py-2.5 text-sm font-semibold text-black bg-yellow-400 rounded-full hover:bg-yellow-300 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-400/25"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <motion.span
                        animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                        className="block w-6 h-0.5 bg-black"
                    />
                    <motion.span
                        animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                        className="block w-6 h-0.5 bg-black"
                    />
                    <motion.span
                        animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                        className="block w-6 h-0.5 bg-black"
                    />
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-black/5 overflow-hidden"
                    >
                        <div className="px-6 py-4 flex flex-col gap-1">
                            <Link href="/track" className="text-sm font-medium text-black/70 py-2.5" onClick={() => setMobileMenuOpen(false)}>
                                Track Shipment
                            </Link>
                            <p className="text-xs text-black/30 uppercase tracking-wider pt-3 pb-1">Services</p>
                            {servicesMenu.map((item) => (
                                <Link key={item.label} href={item.href} className="text-sm text-black/60 py-2 pl-3" onClick={() => setMobileMenuOpen(false)}>
                                    {item.label}
                                </Link>
                            ))}
                            <Link href="/#fleet-section" className="text-sm font-medium text-black/70 py-2.5" onClick={() => setMobileMenuOpen(false)}>
                                Fleet
                            </Link>
                            <Link href="/pricing" className="text-sm font-medium text-black/70 py-2.5" onClick={() => setMobileMenuOpen(false)}>
                                Pricing
                            </Link>
                            <p className="text-xs text-black/30 uppercase tracking-wider pt-3 pb-1">Resources</p>
                            {resourcesMenu.map((item) => (
                                <Link key={item.label} href={item.href} className="text-sm text-black/60 py-2 pl-3" onClick={() => setMobileMenuOpen(false)}>
                                    {item.label}
                                </Link>
                            ))}
                            <Link href="/#contact" className="text-sm font-medium text-black/70 py-2.5" onClick={() => setMobileMenuOpen(false)}>
                                Contact Us
                            </Link>
                            <hr className="border-black/5 my-2" />
                            {status === "authenticated" ? (
                                <>
                                    {isAdmin && (
                                        <Link href="/dashboard" className="text-sm font-semibold text-yellow-600 py-2.5" onClick={() => setMobileMenuOpen(false)}>
                                            Go to Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => { signOut({ callbackUrl: "/" }); setMobileMenuOpen(false); }}
                                        className="text-sm font-medium text-black/70 py-2.5 text-left"
                                    >
                                        Sign Out ({session.user?.name})
                                    </button>
                                </>
                            ) : (
                                <Link href="/login" className="text-sm font-semibold text-black py-2.5" onClick={() => setMobileMenuOpen(false)}>
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
