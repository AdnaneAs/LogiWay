"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonLoader from "@/components/SkeletonLoader";

interface Warehouse {
    id: string;
    name: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    contact: string;
    createdAt: string;
}

interface WarehouseForm {
    name: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    contact: string;
}

const emptyForm: WarehouseForm = {
    name: "", address: "", city: "", province: "", postalCode: "",
    country: "Canada", phone: "", email: "", contact: "",
};

export default function WarehousesPage() {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
    const [form, setForm] = useState<WarehouseForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const filteredWarehouses = warehouses.filter((w) => {
        const q = search.toLowerCase();
        return !q ||
            w.name.toLowerCase().includes(q) ||
            w.address.toLowerCase().includes(q) ||
            w.city.toLowerCase().includes(q) ||
            w.contact.toLowerCase().includes(q);
    });

    useEffect(() => { fetchWarehouses(); }, []);

    const fetchWarehouses = async () => {
        try {
            const res = await fetch("/api/warehouses");
            const data = await res.json();
            if (Array.isArray(data)) setWarehouses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingWarehouse(null);
        setForm(emptyForm);
        setError("");
        setShowModal(true);
    };

    const openEditModal = (w: Warehouse) => {
        setEditingWarehouse(w);
        setForm({
            name: w.name, address: w.address, city: w.city,
            province: w.province, postalCode: w.postalCode, country: w.country,
            phone: w.phone, email: w.email, contact: w.contact,
        });
        setError("");
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.address) {
            setError("Warehouse name and address are required.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            if (editingWarehouse) {
                const res = await fetch(`/api/warehouses/${editingWarehouse.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                if (res.ok) {
                    const updated = await res.json();
                    setWarehouses((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
                    setShowModal(false);
                } else {
                    const err = await res.json();
                    setError(err.error || "Failed to update");
                }
            } else {
                const res = await fetch("/api/warehouses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                if (res.ok) {
                    const created = await res.json();
                    setWarehouses((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
                    setShowModal(false);
                } else {
                    const err = await res.json();
                    setError(err.error || "Failed to create");
                }
            }
        } catch {
            setError("Network error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/warehouses/${id}`, { method: "DELETE" });
            if (res.ok) {
                setWarehouses((prev) => prev.filter((w) => w.id !== id));
                setDeleteConfirm(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const f = (w: Warehouse) => [w.address, w.city, w.province, w.postalCode].filter(Boolean).join(", ");

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-black">Warehouses</h1>
                    <p className="text-sm text-black/40 mt-1">Manage your sender / warehouse locations</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-200 active:scale-95 shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Warehouse
                </button>
            </div>

            <div className="card">
                {loading ? (
                    <div className="space-y-4">
                        <SkeletonLoader className="h-12 w-full" count={5} />
                    </div>
                ) : (
                    <>
                        {/* Filter Bar */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="relative flex-1 max-w-xs">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name, address, contact..."
                                    className="w-full pl-10 pr-4 py-2 text-sm bg-black/[0.03] border border-black/5 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-colors placeholder:text-black/30"
                                />
                                {search && (
                                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <span className="text-xs text-black/30 ml-auto">
                                {filteredWarehouses.length} of {warehouses.length}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/5">
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Name</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Address</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Contact</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Phone</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Email</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredWarehouses.map((w, i) => (
                                        <motion.tr
                                            key={w.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.04 }}
                                            className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors"
                                        >
                                            <td className="py-3 px-4 font-medium text-black">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-yellow-400/10 rounded-full flex items-center justify-center text-xs font-bold text-yellow-600">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                                        </svg>
                                                    </div>
                                                    {w.name}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-black/60 text-xs max-w-[200px] truncate">{f(w)}</td>
                                            <td className="py-3 px-4 text-black/60">{w.contact || "—"}</td>
                                            <td className="py-3 px-4 text-black/60">{w.phone || "—"}</td>
                                            <td className="py-3 px-4 text-black/60">{w.email || "—"}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(w)}
                                                        className="p-1.5 rounded-lg hover:bg-yellow-400/10 text-black/40 hover:text-yellow-600 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    {deleteConfirm === w.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleDelete(w.id)}
                                                                className="text-[10px] px-2 py-1 bg-red-500 text-white rounded font-medium hover:bg-red-600 transition-colors"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(null)}
                                                                className="text-[10px] px-2 py-1 bg-black/5 text-black/50 rounded font-medium hover:bg-black/10 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteConfirm(w.id)}
                                                            className="p-1.5 rounded-lg hover:bg-red-50 text-black/40 hover:text-red-500 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {warehouses.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-black/30 text-sm">
                                                No warehouses found. Click &quot;New Warehouse&quot; to add one.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* CREATE / EDIT MODAL */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-black">
                                    {editingWarehouse ? "Edit Warehouse" : "New Warehouse"}
                                </h2>
                            </div>

                            {error && (
                                <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
                            )}

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium text-black/50 mb-1.5">Warehouse Name *</label>
                                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Montreal HQ" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium text-black/50 mb-1.5">Street Address *</label>
                                        <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" placeholder="e.g. 123 Main St" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-black/50 mb-1.5">City</label>
                                        <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" placeholder="e.g. Montreal" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-black/50 mb-1.5">Province</label>
                                        <input type="text" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className="input-field" placeholder="e.g. QC" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-black/50 mb-1.5">Postal Code</label>
                                        <input type="text" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="input-field" placeholder="e.g. H1A 2B3" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-black/50 mb-1.5">Country</label>
                                        <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field" placeholder="Canada" />
                                    </div>
                                </div>

                                <hr className="border-black/5" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium text-black/50 mb-1.5">Contact Person</label>
                                        <input type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="input-field" placeholder="e.g. John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-black/50 mb-1.5">Phone</label>
                                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="514-555-0000" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-black/50 mb-1.5">Email</label>
                                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="warehouse@company.com" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-8">
                                <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
                                    {saving ? "Saving..." : editingWarehouse ? "Save Changes" : "Add Warehouse"}
                                </button>
                                <button onClick={() => setShowModal(false)} className="px-6 py-3 bg-black/5 text-black/60 font-medium rounded-xl hover:bg-black/10 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
