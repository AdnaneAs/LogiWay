"use client";

import { useEffect, useState, ReactNode } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

interface Shipment {
    id: string;
    trackingId: string;
    origin: string;
    destination: string;
    status: string;
    weight: number;
    clientName: string;
    currency: string;
    weightUnit: string;
    createdAt: string;
    updatedAt: string;
}

const StatusIcons = {
    PENDING: (
        <svg className="w-7 h-7 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    IN_TRANSIT: (
        <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
    ),
    OUT_FOR_DELIVERY: (
        <svg className="w-7 h-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    DELIVERED: (
        <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

const DetailIcons: Record<string, ReactNode> = {
    Weight: (
        <svg className="w-4 h-4 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
    ),
    Client: (
        <svg className="w-4 h-4 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    Created: (
        <svg className="w-4 h-4 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Updated: (
        <svg className="w-4 h-4 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
    ),
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string; borderColor: string; glowColor: string; step: number }> = {
    PENDING: { label: "Pending", color: "text-yellow-700", bgColor: "bg-yellow-50", borderColor: "border-yellow-200", glowColor: "shadow-yellow-400/20", step: 0 },
    IN_TRANSIT: { label: "In Transit", color: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200", glowColor: "shadow-blue-400/20", step: 1 },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "text-orange-700", bgColor: "bg-orange-50", borderColor: "border-orange-200", glowColor: "shadow-orange-400/20", step: 2 },
    DELIVERED: { label: "Delivered", color: "text-green-700", bgColor: "bg-green-50", borderColor: "border-green-200", glowColor: "shadow-green-400/20", step: 3 },
};

const steps = ["Pending", "In Transit", "Out for Delivery", "Delivered"];

export default function TrackingPage() {
    const params = useParams();
    const [shipment, setShipment] = useState<Shipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchShipment = async () => {
            try {
                const res = await fetch(`/api/track/${params.id}`);
                if (!res.ok) throw new Error("Not found");
                const data = await res.json();
                setShipment(data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchShipment();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <div className="relative mx-auto w-16 h-16">
                        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </motion.div>
                    </div>
                    <p className="text-black/40 mt-6 text-sm">Locating your shipment...</p>
                </motion.div>
            </div>
        );
    }

    if (error || !shipment) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                >
                    <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <svg className="w-10 h-10 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </motion.div>
                    <h1 className="text-2xl font-bold text-black mb-2">Shipment Not Found</h1>
                    <p className="text-black/40 mb-6">
                        We couldn&apos;t find a shipment with tracking ID <strong className="text-black">&quot;{params.id}&quot;</strong>.
                        Please double-check and try again.
                    </p>
                    <Link href="/track" className="btn-primary inline-block">
                        Try Again
                    </Link>
                </motion.div>
            </div>
        );
    }

    const currentStatus = statusConfig[shipment.status];
    const currentStep = currentStatus?.step ?? 0;

    return (
        <div className="min-h-screen py-20 px-6 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
            <div className="absolute bottom-40 left-10 w-64 h-64 bg-yellow-400/8 rounded-full blur-2xl" />
            <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-32 right-1/4 w-4 h-4 bg-yellow-400 rounded-full opacity-30"
            />
            <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-48 left-1/3 w-3 h-3 bg-black rounded-full opacity-10"
            />

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Back link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    <Link href="/track" className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black/60 transition-colors group">
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Tracking
                    </Link>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                    className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 overflow-hidden"
                >
                    {/* Card Header — Status Banner */}
                    <div className={`px-8 py-6 ${currentStatus.bgColor} border-b ${currentStatus.borderColor}`}>
                        <div className="flex items-center justify-between">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="flex items-center gap-4"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {StatusIcons[shipment.status as keyof typeof StatusIcons]}
                                </motion.div>
                                <div>
                                    <p className="text-xs text-black/40 uppercase tracking-widest font-medium">Current Status</p>
                                    <p className={`text-xl font-bold ${currentStatus.color}`}>{currentStatus.label}</p>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className={`px-4 py-2 rounded-full ${currentStatus.bgColor} border ${currentStatus.borderColor} ${currentStatus.color} text-sm font-semibold shadow-sm ${currentStatus.glowColor}`}
                            >
                                Step {currentStep + 1} of {steps.length}
                            </motion.div>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-8">
                        {/* Tracking ID */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.4 }}
                            className="mb-8"
                        >
                            <p className="text-xs text-black/35 uppercase tracking-widest mb-1">Tracking ID</p>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-black font-mono tracking-wide">{shipment.trackingId}</h1>
                                <motion.div
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-2.5 h-2.5 bg-yellow-400 rounded-full"
                                />
                            </div>
                        </motion.div>

                        {/* Progress Stepper */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35, duration: 0.5 }}
                            className="mb-10 bg-black/[0.02] rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between relative">
                                {/* Background line */}
                                <div className="absolute top-5 left-[5%] right-[5%] h-1 bg-black/5 rounded-full" />
                                {/* Active line */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(currentStep / (steps.length - 1)) * 90}%` }}
                                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                    className="absolute top-5 left-[5%] h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                                />

                                {steps.map((step, i) => (
                                    <div key={step} className="relative flex flex-col items-center z-10 flex-1">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5 + i * 0.12, duration: 0.35, type: "spring", stiffness: 200 }}
                                            className="relative"
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                                                    ${i <= currentStep
                                                        ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/30"
                                                        : "bg-white border-2 border-black/10 text-black/25"
                                                    }`}
                                            >
                                                {i < currentStep ? (
                                                    <motion.svg
                                                        initial={{ pathLength: 0 }}
                                                        animate={{ pathLength: 1 }}
                                                        transition={{ duration: 0.3, delay: 0.6 + i * 0.12 }}
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </motion.svg>
                                                ) : i === currentStep ? (
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                        className="w-3 h-3 bg-black rounded-full"
                                                    />
                                                ) : (
                                                    i + 1
                                                )}
                                            </div>
                                            {/* Active step pulse ring */}
                                            {i === currentStep && (
                                                <motion.div
                                                    animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                    className="absolute inset-0 bg-yellow-400 rounded-full"
                                                />
                                            )}
                                        </motion.div>
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.7 + i * 0.1 }}
                                            className={`text-[11px] mt-3 text-center leading-tight max-w-[80px] ${i <= currentStep ? "text-black font-semibold" : "text-black/30"}`}
                                        >
                                            {step}
                                        </motion.span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Route Visualization */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="mb-8 bg-gradient-to-r from-black/[0.03] to-transparent rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-4">
                                {/* Origin */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-sm shadow-yellow-400/50" />
                                        <p className="text-[10px] text-black/35 uppercase tracking-widest font-medium">Origin</p>
                                    </div>
                                    <p className="font-semibold text-black text-lg pl-6">{shipment.origin}</p>
                                </div>

                                {/* Animated Arrow */}
                                <div className="flex items-center gap-1 px-2 pt-4">
                                    <motion.div
                                        animate={{ x: [0, 4, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="flex items-center gap-0.5"
                                    >
                                        <div className="w-1.5 h-1.5 bg-yellow-400/60 rounded-full" />
                                        <div className="w-1.5 h-1.5 bg-yellow-400/40 rounded-full" />
                                        <div className="w-1.5 h-1.5 bg-yellow-400/20 rounded-full" />
                                    </motion.div>
                                    <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>

                                {/* Destination */}
                                <div className="flex-1 text-right">
                                    <div className="flex items-center gap-3 mb-1 justify-end">
                                        <p className="text-[10px] text-black/35 uppercase tracking-widest font-medium">Destination</p>
                                        <div className="w-3 h-3 bg-black rounded-full shadow-sm" />
                                    </div>
                                    <p className="font-semibold text-black text-lg pr-6">{shipment.destination}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Detail Cards Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.75, duration: 0.5 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            {[
                                { label: "Weight", value: `${shipment.weight} ${shipment.weightUnit || "lbs"}` },
                                { label: "Client", value: shipment.clientName },
                                { label: "Created", value: new Date(shipment.createdAt).toLocaleDateString() },
                                { label: "Updated", value: new Date(shipment.updatedAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) },
                            ].map((detail, i) => (
                                <motion.div
                                    key={detail.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.85 + i * 0.08 }}
                                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                                    className="bg-black/[0.02] border border-black/5 rounded-xl p-4 group hover:border-yellow-400/20 hover:bg-yellow-400/[0.02] transition-all duration-200 cursor-default"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        {DetailIcons[detail.label]}
                                        <p className="text-[10px] text-black/35 uppercase tracking-widest font-medium">{detail.label}</p>
                                    </div>
                                    <p className="font-semibold text-black text-sm truncate">{detail.value}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="mt-8 flex items-center justify-center gap-4"
                >
                    <Link
                        href="/track"
                        className="px-6 py-3 bg-black/5 text-black/60 font-medium rounded-xl hover:bg-black/10 transition-colors text-sm"
                    >
                        Track Another
                    </Link>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-400/20 text-sm"
                    >
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
