"use client";

import { motion } from "framer-motion";

const vehicles = [
    { id: "TRK-01", type: "18-Wheeler", status: "Active", driver: "Jean Dupont", location: "Highway 401, ON" },
    { id: "TRK-02", type: "Box Truck", status: "Active", driver: "Sarah Chen", location: "Trans-Canada, BC" },
    { id: "TRK-03", type: "Cargo Van", status: "Maintenance", driver: "—", location: "Depot - Montreal" },
    { id: "TRK-04", type: "18-Wheeler", status: "Active", driver: "Mike Brown", location: "Highway 2, AB" },
    { id: "TRK-05", type: "Cargo Van", status: "Idle", driver: "Lisa Park", location: "Depot - Toronto" },
];

const statusColors: Record<string, string> = {
    Active: "bg-green-100 text-green-800",
    Maintenance: "bg-red-100 text-red-800",
    Idle: "bg-gray-100 text-gray-800",
};

export default function FleetPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black">Fleet Management</h1>
                <p className="text-sm text-black/40 mt-1">Monitor and manage your vehicle fleet</p>
            </div>

            {/* Fleet Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {[
                    { label: "Total Vehicles", value: "5", color: "bg-black/5" },
                    { label: "Active", value: "3", color: "bg-green-50" },
                    { label: "In Maintenance", value: "1", color: "bg-red-50" },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`card ${stat.color}`}
                    >
                        <p className="text-3xl font-bold text-black">{stat.value}</p>
                        <p className="text-xs text-black/40 mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Fleet Table */}
            <div className="card">
                <h2 className="font-bold text-black mb-6">All Vehicles</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-black/5">
                                <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Vehicle ID</th>
                                <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Type</th>
                                <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Driver</th>
                                <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Location</th>
                                <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((v, i) => (
                                <motion.tr
                                    key={v.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]"
                                >
                                    <td className="py-3 px-4 font-mono font-medium text-black">{v.id}</td>
                                    <td className="py-3 px-4 text-black/60">{v.type}</td>
                                    <td className="py-3 px-4 text-black/60">{v.driver}</td>
                                    <td className="py-3 px-4 text-black/60">{v.location}</td>
                                    <td className="py-3 px-4">
                                        <span className={`badge ${statusColors[v.status]}`}>{v.status}</span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
