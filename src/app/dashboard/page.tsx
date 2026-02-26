"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SkeletonLoader from "@/components/SkeletonLoader";

interface Shipment {
    id: string;
    trackingId: string;
    origin: string;
    destination: string;
    status: string;
    weight: number;
    clientName: string;
    createdAt: string;
}

const statusColors: Record<string, string> = {
    PENDING: "badge-pending",
    IN_TRANSIT: "badge-in-transit",
    OUT_FOR_DELIVERY: "badge-out-for-delivery",
    DELIVERED: "badge-delivered",
};

const statusLabels: Record<string, string> = {
    PENDING: "Pending",
    IN_TRANSIT: "In Transit",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
};

export default function DashboardPage() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/shipments")
            .then((res) => res.json())
            .then((data) => {
                setShipments(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const stats = [
        {
            label: "Total Shipments",
            value: shipments.length,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            color: "bg-black/5 text-black",
        },
        {
            label: "In Transit",
            value: shipments.filter((s) => s.status === "IN_TRANSIT").length,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            color: "bg-blue-50 text-blue-600",
        },
        {
            label: "Delivered",
            value: shipments.filter((s) => s.status === "DELIVERED").length,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "bg-green-50 text-green-600",
        },
        {
            label: "Pending",
            value: shipments.filter((s) => s.status === "PENDING").length,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "bg-yellow-50 text-yellow-600",
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black">Dashboard</h1>
                <p className="text-sm text-black/40 mt-1">Overview of your logistics operations</p>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <SkeletonLoader className="h-28" count={4} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className="card"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-black">{stat.value}</p>
                            <p className="text-xs text-black/40 mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Recent Shipments */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-black">Recent Shipments</h2>
                    <a
                        href="/dashboard/shipments"
                        className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                        View All →
                    </a>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        <SkeletonLoader className="h-12 w-full" count={5} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-black/5">
                                    <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">
                                        Tracking ID
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">
                                        Client
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">
                                        Route
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {shipments.slice(0, 5).map((shipment, i) => (
                                    <motion.tr
                                        key={shipment.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors"
                                    >
                                        <td className="py-3 px-4 font-mono font-medium text-black">
                                            {shipment.trackingId}
                                        </td>
                                        <td className="py-3 px-4 text-black/60">{shipment.clientName}</td>
                                        <td className="py-3 px-4 text-black/60">
                                            {shipment.origin} → {shipment.destination}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={statusColors[shipment.status]}>
                                                {statusLabels[shipment.status]}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
