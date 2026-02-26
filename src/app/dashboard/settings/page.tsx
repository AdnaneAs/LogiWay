"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchLogo();
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

                {/* Profile */}
                <motion.div
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
                </motion.div>

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
