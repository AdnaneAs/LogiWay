"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    // WhatsApp & Support Email
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [supportEmail, setSupportEmail] = useState("");
    const [supportSaving, setSupportSaving] = useState(false);
    const [supportMsg, setSupportMsg] = useState("");

    useEffect(() => {
        fetchLogo();
        fetchWhatsapp();
    }, []);

    const fetchLogo = async () => {
        try {
            const res = await fetch("/api/settings/logo");
            const data = await res.json();
            if (data.logoUrl) setLogoUrl(data.logoUrl);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchWhatsapp = async () => {
        try {
            const res = await fetch("/api/settings/whatsapp");
            const data = await res.json();
            setWhatsappNumber(data.whatsappNumber || "");
            setSupportEmail(data.supportEmail || "");
        } catch (err) {
            console.error(err);
        }
    };

    const saveSupport = async () => {
        setSupportSaving(true);
        setSupportMsg("");
        try {
            const res = await fetch("/api/settings/whatsapp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ whatsappNumber, supportEmail }),
            });
            if (res.ok) {
                setSupportMsg("Support info saved!");
            } else {
                setSupportMsg("Failed to save.");
            }
        } catch {
            setSupportMsg("Network error.");
        } finally {
            setSupportSaving(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setUploadMsg("Please select an image file.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setUploadMsg("Image must be under 2MB.");
            return;
        }

        setUploading(true);
        setUploadMsg("");

        const formData = new FormData();
        formData.append("logo", file);

        try {
            const res = await fetch("/api/settings/logo", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setLogoUrl(data.logoUrl);
                setUploadMsg("Logo uploaded successfully!");
            } else {
                setUploadMsg(data.error || "Upload failed.");
            }
        } catch {
            setUploadMsg("Network error.");
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black">Settings</h1>
                <p className="text-sm text-black/40 mt-1">Manage your account and application settings</p>
            </div>

            <div className="space-y-6">
                {/* Company Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="card"
                >
                    <h2 className="font-bold text-black mb-2">Company Logo</h2>
                    <p className="text-xs text-black/40 mb-6">
                        Upload your company logo. It will appear on shipment receipts and documents.
                    </p>

                    <div className="flex items-start gap-6">
                        {/* Preview */}
                        <div className="w-32 h-32 bg-black/[0.03] border-2 border-dashed border-black/10 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt="Company Logo"
                                    className="w-full h-full object-contain p-2"
                                />
                            ) : (
                                <div className="text-center">
                                    <svg className="w-8 h-8 text-black/20 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-[10px] text-black/25">No logo</p>
                                </div>
                            )}
                        </div>

                        {/* Upload area */}
                        <div className="flex-1">
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="hidden"
                                id="logo-upload"
                            />
                            <label
                                htmlFor="logo-upload"
                                className={`inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-200 cursor-pointer active:scale-95 ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                {uploading ? "Uploading..." : logoUrl ? "Change Logo" : "Upload Logo"}
                            </label>
                            <p className="text-[11px] text-black/30 mt-3">
                                PNG, JPG or SVG. Max 2MB. Recommended: square, min 200×200px.
                            </p>
                            {uploadMsg && (
                                <p className={`text-xs mt-2 ${uploadMsg.includes("success") ? "text-green-600" : "text-red-500"}`}>
                                    {uploadMsg}
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Support Channels */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="card"
                >
                    <h2 className="font-bold text-black mb-1">Support Channels</h2>
                    <p className="text-xs text-black/40 mb-6">These will be displayed in the website footer and the live support chat bubble.</p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* WhatsApp */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-black/70">WhatsApp</span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 text-sm">+</span>
                                <input
                                    type="tel"
                                    value={whatsappNumber}
                                    onChange={(e) => setWhatsappNumber(e.target.value)}
                                    placeholder="15145551234"
                                    className="input-field pl-7"
                                />
                            </div>
                            <p className="text-[11px] text-black/25 mt-1.5">Full number with country code, no spaces.</p>
                        </div>

                        {/* Email */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-black/70">Email</span>
                            </div>
                            <input
                                type="email"
                                value={supportEmail}
                                onChange={(e) => setSupportEmail(e.target.value)}
                                placeholder="support@yourcompany.com"
                                className="input-field"
                            />
                            <p className="text-[11px] text-black/25 mt-1.5">Displayed in the website footer.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-5">
                        <button
                            onClick={saveSupport}
                            disabled={supportSaving}
                            className="px-5 py-2.5 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-200 active:scale-95 disabled:opacity-50"
                        >
                            {supportSaving ? "Saving..." : "Save Support Info"}
                        </button>
                        {supportMsg && (
                            <p className={`text-xs ${supportMsg.includes("saved") ? "text-green-600" : "text-red-500"}`}>
                                {supportMsg}
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Profile */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="card"
                >
                    <h2 className="font-bold text-black mb-6">Profile</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-black/60 mb-2">Full Name</label>
                            <input type="text" defaultValue="Admin User" className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black/60 mb-2">Email</label>
                            <input type="email" defaultValue="" className="input-field" disabled />
                        </div>
                    </div>
                </motion.div> */}

                {/* Notifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="card"
                >
                    <h2 className="font-bold text-black mb-6">Notifications</h2>
                    <div className="space-y-4">
                        {[
                            { label: "Email notifications for status updates", enabled: true },
                            { label: "SMS alerts for delivery exceptions", enabled: false },
                            { label: "Daily summary report", enabled: true },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between py-2">
                                <span className="text-sm text-black/60">{item.label}</span>
                                <div
                                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${item.enabled ? "bg-yellow-400" : "bg-black/10"
                                        }`}
                                >
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${item.enabled ? "translate-x-5" : "translate-x-1"
                                            }`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Danger Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="card border-red-100"
                >
                    <h2 className="font-bold text-red-600 mb-2">Danger Zone</h2>
                    <p className="text-sm text-black/40 mb-4">
                        These actions are irreversible. Proceed with caution.
                    </p>
                    <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                        Reset All Settings
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
