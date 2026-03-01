"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonLoader from "@/components/SkeletonLoader";

interface Address {
    id: string;
    label: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    addresses: Address[];
    createdAt: string;
}

interface ClientForm {
    name: string;
    email: string;
    phone: string;
    company: string;
}

interface AddressForm {
    label: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

const emptyForm: ClientForm = { name: "", email: "", phone: "", company: "" };
const emptyAddress: AddressForm = { label: "", street: "", city: "", province: "", postalCode: "", country: "Canada", isDefault: false };

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [form, setForm] = useState<ClientForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    // Addresses state
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [newAddresses, setNewAddresses] = useState<AddressForm[]>([]);
    const [deletedAddressIds, setDeletedAddressIds] = useState<string[]>([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressForm, setAddressForm] = useState<AddressForm>({ ...emptyAddress });

    const filteredClients = clients.filter((c) => {
        const q = search.toLowerCase();
        return !q ||
            c.name.toLowerCase().includes(q) ||
            c.company.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.toLowerCase().includes(q);
    });

    useEffect(() => { fetchClients(); }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch("/api/clients");
            const data = await res.json();
            if (Array.isArray(data)) setClients(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingClient(null);
        setForm(emptyForm);
        setAddresses([]);
        setNewAddresses([]);
        setDeletedAddressIds([]);
        setShowAddressForm(false);
        setAddressForm({ ...emptyAddress });
        setError("");
        setShowModal(true);
    };

    const openEditModal = (client: Client) => {
        setEditingClient(client);
        setForm({
            name: client.name,
            email: client.email,
            phone: client.phone,
            company: client.company,
        });
        setAddresses(client.addresses || []);
        setNewAddresses([]);
        setDeletedAddressIds([]);
        setShowAddressForm(false);
        setAddressForm({ ...emptyAddress });
        setError("");
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name) {
            setError("Client name is required.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            let clientId: string;

            if (editingClient) {
                const res = await fetch(`/api/clients/${editingClient.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                if (!res.ok) {
                    const err = await res.json();
                    setError(err.error || "Failed to update");
                    setSaving(false);
                    return;
                }
                clientId = editingClient.id;
            } else {
                const res = await fetch("/api/clients", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
                if (!res.ok) {
                    const err = await res.json();
                    setError(err.error || "Failed to create");
                    setSaving(false);
                    return;
                }
                const created = await res.json();
                clientId = created.id;
            }

            // Handle address changes
            for (const addrId of deletedAddressIds) {
                await fetch(`/api/clients/${clientId}/addresses/${addrId}`, { method: "DELETE" });
            }
            for (const addr of addresses) {
                const original = editingClient?.addresses?.find(a => a.id === addr.id);
                if (original && original.isDefault !== addr.isDefault) {
                    await fetch(`/api/clients/${clientId}/addresses/${addr.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ isDefault: addr.isDefault }),
                    });
                }
            }
            for (const newAddr of newAddresses) {
                await fetch(`/api/clients/${clientId}/addresses`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newAddr),
                });
            }

            await fetchClients();
            setShowModal(false);
        } catch {
            setError("Network error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
            if (res.ok) {
                setClients((prev) => prev.filter((c) => c.id !== id));
                setDeleteConfirm(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Address helpers
    const addNewAddress = () => {
        if (!addressForm.street || !addressForm.city) {
            setError("Street and city are required for an address.");
            return;
        }
        const allAddresses = [...addresses.filter(a => !deletedAddressIds.includes(a.id)), ...newAddresses];
        const shouldBeDefault = addressForm.isDefault || allAddresses.length === 0;

        if (shouldBeDefault) {
            setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })));
            setNewAddresses(prev => prev.map(a => ({ ...a, isDefault: false })));
        }

        setNewAddresses(prev => [...prev, { ...addressForm, isDefault: shouldBeDefault }]);
        setAddressForm({ ...emptyAddress });
        setShowAddressForm(false);
        setError("");
    };

    const removeExistingAddress = (id: string) => {
        setDeletedAddressIds(prev => [...prev, id]);
    };

    const removeNewAddress = (idx: number) => {
        setNewAddresses(prev => prev.filter((_, i) => i !== idx));
    };

    const setDefaultExisting = (id: string) => {
        setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
        setNewAddresses(prev => prev.map(a => ({ ...a, isDefault: false })));
    };

    const setDefaultNew = (idx: number) => {
        setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })));
        setNewAddresses(prev => prev.map((a, i) => ({ ...a, isDefault: i === idx })));
    };

    const formatAddress = (a: { street: string; city: string; province: string; postalCode: string }) =>
        [a.street, a.city, a.province, a.postalCode].filter(Boolean).join(", ");

    const visibleExisting = addresses.filter(a => !deletedAddressIds.includes(a.id));
    const totalAddresses = visibleExisting.length + newAddresses.length;

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-black">Clients</h1>
                    <p className="text-sm text-black/40 mt-1">Manage your B2B client accounts</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-200 active:scale-95 shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Client
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
                                    placeholder="Search by name, company, email..."
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
                                {filteredClients.length} of {clients.length}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/5">
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Client</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Company</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Email</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Phone</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Addresses</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Added</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map((client, i) => (
                                        <motion.tr
                                            key={client.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.04 }}
                                            className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors"
                                        >
                                            <td className="py-3 px-4 font-medium text-black">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-yellow-400/10 rounded-full flex items-center justify-center text-xs font-bold text-yellow-600">
                                                        {client.name.charAt(0)}
                                                    </div>
                                                    {client.name}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-black/60">{client.company || "—"}</td>
                                            <td className="py-3 px-4 text-black/60">{client.email || "—"}</td>
                                            <td className="py-3 px-4 text-black/60">{client.phone || "—"}</td>
                                            <td className="py-3 px-4">
                                                <span className="inline-flex items-center gap-1 text-xs bg-black/[0.04] px-2 py-0.5 rounded-md text-black/50">
                                                    {client.addresses?.length || 0}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-black/40 text-xs">
                                                {new Date(client.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(client)}
                                                        className="p-1.5 rounded-lg hover:bg-yellow-400/10 text-black/40 hover:text-yellow-600 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    {deleteConfirm === client.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleDelete(client.id)}
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
                                                            onClick={() => setDeleteConfirm(client.id)}
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
                                    {clients.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-black/30 text-sm">
                                                No clients found. Click &quot;New Client&quot; to add one.
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={editingClient ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"} />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-black">
                                    {editingClient ? "Edit Client" : "New Client"}
                                </h2>
                            </div>

                            {error && (
                                <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-black/50 mb-1.5">Client Name *</label>
                                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Acme Industries" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-black/50 mb-1.5">Company</label>
                                    <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field" placeholder="e.g. Acme Industries Inc." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-black/50 mb-1.5">Email</label>
                                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="contact@acme.com" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-black/50 mb-1.5">Phone</label>
                                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="514-555-0000" />
                                    </div>
                                </div>
                            </div>

                            {/* ── ADDRESSES SECTION ── */}
                            <div className="mt-6 pt-5 border-t border-black/5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-bold text-black/40 uppercase tracking-wider">
                                        Addresses
                                        <span className="text-black/25 ml-2 normal-case">({totalAddresses})</span>
                                    </h3>
                                    <button
                                        onClick={() => setShowAddressForm(true)}
                                        className="flex items-center gap-1 text-xs font-semibold text-yellow-600 hover:text-yellow-500 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        Add Address
                                    </button>
                                </div>

                                {/* Existing addresses */}
                                <div className="space-y-2">
                                    {visibleExisting.map((addr) => (
                                        <div key={addr.id} className="flex items-center gap-3 bg-black/[0.02] border border-black/5 rounded-xl px-4 py-3">
                                            <button
                                                onClick={() => setDefaultExisting(addr.id)}
                                                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${addr.isDefault ? "border-yellow-400 bg-yellow-400" : "border-black/20 hover:border-yellow-400"
                                                    }`}
                                                title={addr.isDefault ? "Default address" : "Set as default"}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-black truncate">
                                                    {addr.label && <span className="text-yellow-600 mr-1.5">{addr.label}</span>}
                                                    {formatAddress(addr)}
                                                </p>
                                                {addr.isDefault && <span className="text-[10px] text-yellow-600 font-semibold">DEFAULT</span>}
                                            </div>
                                            <button
                                                onClick={() => removeExistingAddress(addr.id)}
                                                className="text-black/20 hover:text-red-500 transition-colors flex-shrink-0"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}

                                    {/* New addresses (not yet saved) */}
                                    {newAddresses.map((addr, idx) => (
                                        <div key={`new-${idx}`} className="flex items-center gap-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl px-4 py-3">
                                            <button
                                                onClick={() => setDefaultNew(idx)}
                                                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${addr.isDefault ? "border-yellow-400 bg-yellow-400" : "border-black/20 hover:border-yellow-400"
                                                    }`}
                                                title={addr.isDefault ? "Default address" : "Set as default"}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-black truncate">
                                                    {addr.label && <span className="text-yellow-600 mr-1.5">{addr.label}</span>}
                                                    {formatAddress(addr)}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    {addr.isDefault && <span className="text-[10px] text-yellow-600 font-semibold">DEFAULT</span>}
                                                    <span className="text-[10px] text-black/30">New</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeNewAddress(idx)}
                                                className="text-black/20 hover:text-red-500 transition-colors flex-shrink-0"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Inline add address form */}
                                <AnimatePresence>
                                    {showAddressForm && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-3 bg-black/[0.02] border border-black/5 rounded-xl p-4 space-y-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-[10px] font-medium text-black/40 mb-1">Label</label>
                                                        <input type="text" value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} className="input-field !text-sm" placeholder="e.g. Head Office" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-medium text-black/40 mb-1">Street *</label>
                                                        <input type="text" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} className="input-field !text-sm" placeholder="123 Main St" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-[10px] font-medium text-black/40 mb-1">City *</label>
                                                        <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="input-field !text-sm" placeholder="Montreal" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-medium text-black/40 mb-1">Province</label>
                                                        <input type="text" value={addressForm.province} onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })} className="input-field !text-sm" placeholder="QC" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-medium text-black/40 mb-1">Postal Code</label>
                                                        <input type="text" value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} className="input-field !text-sm" placeholder="H1A 2B3" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 pt-1">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={addressForm.isDefault}
                                                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                                            className="w-3.5 h-3.5 rounded border-black/20 text-yellow-400 focus:ring-yellow-400/20"
                                                        />
                                                        <span className="text-xs text-black/50">Set as default</span>
                                                    </label>
                                                    <div className="ml-auto flex gap-2">
                                                        <button onClick={() => { setShowAddressForm(false); setAddressForm({ ...emptyAddress }); }} className="text-xs px-3 py-1.5 bg-black/5 text-black/50 rounded-lg hover:bg-black/10 transition-colors">Cancel</button>
                                                        <button onClick={addNewAddress} className="text-xs px-3 py-1.5 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-colors">Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {totalAddresses === 0 && !showAddressForm && (
                                    <p className="text-xs text-black/25 mt-2">No addresses yet. Click &quot;Add Address&quot; to add one.</p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 mt-8">
                                <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
                                    {saving ? "Saving..." : editingClient ? "Save Changes" : "Add Client"}
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
