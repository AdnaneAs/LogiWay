"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [supportEmail, setSupportEmail] = useState("");

    useEffect(() => {
        fetch("/api/support")
            .then((r) => r.json())
            .then((d) => {
                setWhatsappNumber(d.whatsappNumber || "");
                setSupportEmail(d.supportEmail || "");
            })
            .catch(() => {});
    }, []);

    const whatsappUrl = whatsappNumber
        ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`
        : "";

    const formatPhone = (num: string) => {
        const d = num.replace(/\D/g, "");
        if (d.length === 11) return `+${d[0]} (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
        if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
        return `+${d}`;
    };

    return (
        <footer className="border-t border-black/5 py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Logo */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                <span className="text-black font-bold text-sm">L</span>
                            </div>
                            <span className="font-semibold text-black">Shipswipe Logistics</span>
                        </div>
                        <p className="text-xs text-black/30 leading-relaxed">
                            Enterprise-grade logistics infrastructure for B2B companies across USA and Canada.
                        </p>

                        {/* Contact info */}
                        {(whatsappNumber || supportEmail) && (
                            <div className="mt-4 space-y-2">
                                {whatsappNumber && (
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-xs text-black/40 hover:text-green-600 transition-colors group"
                                    >
                                        <svg className="w-3.5 h-3.5 text-green-500 group-hover:text-green-600 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        {formatPhone(whatsappNumber)}
                                    </a>
                                )}
                                {supportEmail && (
                                    <a
                                        href={`mailto:${supportEmail}`}
                                        className="flex items-center gap-2 text-xs text-black/40 hover:text-blue-600 transition-colors group"
                                    >
                                        <svg className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {supportEmail}
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Services */}
                    <div>
                        <p className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-3">Services</p>
                        <ul className="space-y-2">
                            <li><Link href="/login" className="text-sm text-black/40 hover:text-black transition-colors">International Freight</Link></li>
                            <li><Link href="/login" className="text-sm text-black/40 hover:text-black transition-colors">Domestic Delivery</Link></li>
                            <li><Link href="/login" className="text-sm text-black/40 hover:text-black transition-colors">Last Mile</Link></li>
                        </ul>
                    </div>
                    {/* Resources */}
                    <div>
                        <p className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-3">Resources</p>
                        <ul className="space-y-2">
                            <li><Link href="/about#about" className="text-sm text-black/40 hover:text-black transition-colors">About Us</Link></li>
                            <li><Link href="/about#case-studies" className="text-sm text-black/40 hover:text-black transition-colors">Case Studies</Link></li>
                            <li><Link href="/about#documentation" className="text-sm text-black/40 hover:text-black transition-colors">Documentation</Link></li>
                            <li><Link href="/pricing" className="text-sm text-black/40 hover:text-black transition-colors">Pricing</Link></li>
                            <li><Link href="/#contact" className="text-sm text-black/40 hover:text-black transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    {/* Legal */}
                    <div>
                        <p className="text-xs font-semibold text-black/50 uppercase tracking-wider mb-3">Legal</p>
                        <ul className="space-y-2">
                            <li><Link href="/privacy-policy" className="text-sm text-black/40 hover:text-black transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/TOS" className="text-sm text-black/40 hover:text-black transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-black/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-black/30">
                        © 2026 Shipswipe Logistics. All rights reserved.
                    </p>
                    <p className="text-xs text-black/20">
                        Built for enterprise logistics.
                    </p>
                </div>
            </div>
        </footer>
    );
}
