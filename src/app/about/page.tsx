"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

/* ────────── DATA ────────── */
const milestones = [
    { year: "2018", title: "Founded", desc: "Shipswipe Logistics launched in Montreal with 3 trucks and a bold vision for B2B logistics.", side: "left" as const },
    { year: "2019", title: "Regional Expansion", desc: "Expanded operations to Ontario and the Maritime provinces, growing the fleet to 25 vehicles.", side: "right" as const },
    { year: "2020", title: "Digital Transformation", desc: "Built out our proprietary tracking API and onboarded our first 50 enterprise clients.", side: "left" as const },
    { year: "2021", title: "Technology Platform", desc: "Launched real-time GPS tracking, automated notifications, and the client dashboard.", side: "right" as const },
    { year: "2023", title: "Interational Coverage", desc: "Full coast-to-coast coverage across all US states and Canadian provinces.", side: "left" as const },
    { year: "2024", title: "Enterprise Scale", desc: "Serving 500+ B2B clients with 10,000+ monthly deliveries and 150+ fleet vehicles.", side: "right" as const },
];

const caseStudies = [
    {
        company: "NovaTech Industries",
        industry: "Electronics Manufacturing",
        result: "38% reduction in shipping costs",
        quote: "Shipswipe transformed our supply chain. Their real-time tracking gave us visibility we never had before.",
        metrics: { deliveries: "2,400/mo", onTime: "99.9%", savings: "$180K/yr" },
    },
    {
        company: "FreshHarvest Co.",
        industry: "Food & Beverage",
        result: "99.7% cold-chain compliance",
        quote: "Their refrigerated fleet and temperature monitoring are best-in-class. Zero spoilage incidents in 18 months.",
        metrics: { deliveries: "1,800/mo", onTime: "99.7%", savings: "$95K/yr" },
    },
    {
        company: "BuildRight Supply",
        industry: "Construction Materials",
        result: "52% faster delivery times",
        quote: "We cut our average delivery window from 5 days to 2.4 days. Our clients noticed immediately.",
        metrics: { deliveries: "850/mo", onTime: "99.5%", savings: "$220K/yr" },
    },
];

const docCategories = [
    {
        title: "Getting Started",
        desc: "Account setup, first shipment, and platform overview.",
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        articles: ["Quick Start Guide", "Account Configuration", "Your First Shipment"],
    },
    {
        title: "API Reference",
        desc: "RESTful endpoints for shipment management and tracking.",
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        articles: ["Authentication", "Shipments API", "Webhooks & Events"],
    },
    {
        title: "Integrations",
        desc: "Connect Shipswipe with your ERP, WMS, or e-commerce platform.",
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
        articles: ["Shopify Plugin", "SAP Integration", "Custom Webhooks"],
    },
    {
        title: "Fleet Management",
        desc: "Vehicle tracking, driver management, and route optimization.",
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
        ),
        articles: ["GPS Tracking Setup", "Driver Portal", "Route Planner"],
    },
];

const values = [
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: "Reliability",
        desc: "99.8% on-time delivery rate. Every shipment matters.",
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        ),
        title: "Transparency",
        desc: "Full visibility at every stage. No hidden fees, no surprises.",
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        title: "Partnership",
        desc: "We don't just ship — we become an extension of your team.",
    },
];

/* ────────── NAV TABS ────────── */
const tabs = [
    { id: "about", label: "About Us" },
    { id: "case-studies", label: "Case Studies" },
    { id: "documentation", label: "Documentation" },
    { id: "blog", label: "Blog" },
];

/* ════════════════════════════════ */
/*          RESOURCES PAGE         */
/* ════════════════════════════════ */
export default function ResourcesPage() {
    const scrollToSection = (id: string) => {
        if (id === "blog") {
            window.location.href = "/login";
            return;
        }
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen">
            {/* ──── HERO ──── */}
            <section className="py-20 px-6 relative overflow-hidden">
                {/* Decorative elements */}
                <motion.div
                    animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-16 right-20 w-20 h-20 bg-yellow-400/10 rounded-full blur-xl"
                />
                <motion.div
                    animate={{ y: [8, -12, 8] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-10 left-16 w-4 h-4 bg-yellow-400 rounded-full opacity-30"
                />
                <motion.div
                    animate={{ y: [-5, 8, -5], x: [3, -3, 3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-32 left-1/4 w-3 h-3 bg-black rounded-full opacity-10"
                />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 rounded-full mb-6"
                        >
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-black/60">Resources & Company</span>
                        </motion.div>

                        <h1 className="text-4xl lg:text-6xl font-bold text-black leading-tight">
                            Everything you need<span className="text-yellow-400">.</span>
                        </h1>
                        <p className="text-lg text-black/40 mt-6 max-w-2xl mx-auto leading-relaxed">
                            Case studies, documentation, guides, and the story behind Shipswipe Logistics — all in one place.
                        </p>
                    </motion.div>

                    {/* Tab Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mt-10 flex flex-wrap justify-center gap-2"
                    >
                        {tabs.map((tab, i) => (
                            <motion.button
                                key={tab.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
                                onClick={() => scrollToSection(tab.id)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${tab.id === "blog"
                                    ? "bg-black/5 text-black/50 hover:bg-black/10"
                                    : "bg-yellow-400/10 text-black/70 hover:bg-yellow-400/20 hover:text-black"
                                    }`}
                            >
                                {tab.label}
                                {tab.id === "blog" && (
                                    <span className="ml-1.5 text-[10px] bg-black/10 px-1.5 py-0.5 rounded text-black/40">Login</span>
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ──── ABOUT US ──── */}
            <section className="py-20 px-6" id="about">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-black">
                            About us<span className="text-yellow-400">.</span>
                        </h2>
                        <p className="text-black/40 mt-4 max-w-2xl mx-auto">
                            Founded in 2018, Shipswipe Logistics has grown from a small Montreal-based courier
                            into one of North America&apos;s most trusted B2B logistics platforms.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        {[
                            { value: "500+", label: "B2B Clients" },
                            { value: "10K+", label: "Monthly Deliveries" },
                            { value: "99.8%", label: "On-Time Rate" },
                            { value: "150+", label: "Fleet Vehicles" },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring", stiffness: 150 }}
                                className="text-center card py-6"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="text-3xl font-bold text-black"
                                >
                                    {stat.value}
                                </motion.div>
                                <div className="text-sm text-black/40 mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Values */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {values.map((value, i) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5, type: "spring", stiffness: 120 }}
                                whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(250, 204, 21, 0.08)" }}
                                className="card text-center group"
                            >
                                <div className="relative w-14 h-14 mx-auto mb-4">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0, 0.15] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                                        className="absolute inset-0 bg-yellow-400/20 rounded-2xl"
                                    />
                                    <div className="relative w-14 h-14 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:bg-yellow-400/20 transition-colors">
                                        {value.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-black mb-2">{value.title}</h3>
                                <p className="text-sm text-black/40">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* ── TIMELINE ── */}
                    <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-black text-center mb-16"
                    >
                        Our journey<span className="text-yellow-400">.</span>
                    </motion.h3>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-yellow-400/0 via-yellow-400/30 to-yellow-400/0 hidden md:block" />

                        <div className="space-y-12 md:space-y-0">
                            {milestones.map((m, i) => (
                                <motion.div
                                    key={m.year}
                                    initial={{ opacity: 0, x: m.side === "left" ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 15 }}
                                    className={`relative md:flex items-center md:mb-12 ${m.side === "left" ? "md:flex-row" : "md:flex-row-reverse"
                                        }`}
                                >
                                    {/* Content card */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className={`md:w-[calc(50%-2rem)] card p-6 ${m.side === "left" ? "md:mr-auto md:text-right" : "md:ml-auto"
                                            }`}
                                    >
                                        <p className="text-xs text-yellow-500 font-bold uppercase tracking-wider mb-1">{m.year}</p>
                                        <h4 className="text-lg font-bold text-black">{m.title}</h4>
                                        <p className="text-sm text-black/40 mt-1">{m.desc}</p>
                                    </motion.div>

                                    {/* Center dot */}
                                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                                            className="relative"
                                        >
                                            <div className="w-5 h-5 bg-yellow-400 rounded-full border-4 border-white shadow-md" />
                                            <motion.div
                                                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                                                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                                                className="absolute inset-0 bg-yellow-400 rounded-full"
                                            />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ──── CASE STUDIES ──── */}
            <section className="py-24 bg-black/[0.02] relative overflow-hidden" id="case-studies">
                <motion.div
                    animate={{ y: [-8, 8, -8], x: [3, -3, 3] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-16 w-6 h-6 bg-yellow-400 rounded-full opacity-20"
                />
                <motion.div
                    animate={{ y: [6, -10, 6] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-16 left-20 w-3 h-3 bg-black rounded-full opacity-10"
                />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 rounded-full mb-6"
                        >
                            <span className="text-sm font-medium text-black/60">Real Results</span>
                        </motion.div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-black">
                            Case studies<span className="text-yellow-400">.</span>
                        </h2>
                        <p className="text-black/40 mt-4 max-w-xl mx-auto">
                            See how leading businesses trust Shipswipe to power their logistics.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {caseStudies.map((cs, i) => (
                            <motion.div
                                key={cs.company}
                                initial={{ opacity: 0, y: 35, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5, type: "spring", stiffness: 100 }}
                                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }}
                                className="card p-8 flex flex-col group"
                            >
                                {/* Industry badge */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                                    <span className="text-xs text-black/40 font-medium">{cs.industry}</span>
                                </div>

                                <h3 className="text-xl font-bold text-black">{cs.company}</h3>

                                <p className="text-yellow-600 font-semibold text-sm mt-2">{cs.result}</p>

                                <p className="text-sm text-black/40 mt-4 italic leading-relaxed flex-1">
                                    &ldquo;{cs.quote}&rdquo;
                                </p>

                                {/* Metrics */}
                                <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-black/5">
                                    {Object.entries(cs.metrics).map(([key, val]) => (
                                        <div key={key} className="text-center">
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 + i * 0.1 }}
                                                className="text-lg font-bold text-black"
                                            >
                                                {val}
                                            </motion.p>
                                            <p className="text-[10px] text-black/30 uppercase tracking-wider mt-0.5">
                                                {key === "onTime" ? "On-Time" : key === "savings" ? "Savings" : "Deliveries"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── DOCUMENTATION ──── */}
            <section className="py-24" id="documentation">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-black">
                            Documentation<span className="text-yellow-400">.</span>
                        </h2>
                        <p className="text-black/40 mt-4 max-w-xl mx-auto">
                            Guides, API references, and integration docs to get you up and running.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {docCategories.map((cat, i) => (
                            <motion.div
                                key={cat.title}
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12, duration: 0.5, type: "spring", stiffness: 120 }}
                                whileHover={{ y: -6, boxShadow: "0 16px 32px rgba(250,204,21,0.08)" }}
                                className="card p-6 group"
                            >
                                <div className="relative w-12 h-12 mb-4">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 25 + i * 5, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 rounded-xl border-2 border-dashed border-yellow-400/15"
                                    />
                                    <div className="absolute inset-0 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-500 group-hover:bg-yellow-400/20 transition-colors">
                                        {cat.icon}
                                    </div>
                                </div>

                                <h3 className="font-bold text-black mb-1">{cat.title}</h3>
                                <p className="text-xs text-black/40 mb-4">{cat.desc}</p>

                                <ul className="space-y-2">
                                    {cat.articles.map((article) => (
                                        <li key={article}>
                                            <Link
                                                href="/login"
                                                className="flex items-center gap-2 text-sm text-black/50 hover:text-yellow-600 transition-colors group/link"
                                            >
                                                <svg className="w-3 h-3 text-yellow-400 opacity-0 group-hover/link:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                                {article}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Full docs CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center"
                    >
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-black/80 transition-all duration-300 hover:shadow-lg"
                        >
                            View Full Documentation
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
