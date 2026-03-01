"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonLoader from "@/components/SkeletonLoader";
import jsPDF from "jspdf";

interface ShipmentItem {
    id?: string;
    description: string;
    quantity: number;
    weight: number;
    unitValue: number;
    sku: string;
}

interface Shipment {
    id: string;
    trackingId: string;
    origin: string;
    destination: string;
    status: string;
    weight: number;
    clientName: string;
    senderName: string;
    senderEmail: string;
    senderPhone: string;
    senderAddress: string;
    notes: string;
    items: ShipmentItem[];
    createdAt: string;
    updatedAt: string;
}

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
}

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
}

interface ClientForm {
    name: string;
    email: string;
    phone: string;
    company: string;
}

const emptyItem: ShipmentItem = { description: "", quantity: 1, weight: 0, unitValue: 0, sku: "" };

const emptyClientForm: ClientForm = { name: "", email: "", phone: "", company: "" };

const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "IN_TRANSIT", label: "In Transit" },
    { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
    { value: "DELIVERED", label: "Delivered" },
];

export default function ShipmentsPage() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Form state
    const [trackingId, setTrackingId] = useState("");
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [weight, setWeight] = useState("");
    const [clientName, setClientName] = useState("");
    const [formStatus, setFormStatus] = useState("PENDING");
    const [senderName, setSenderName] = useState("");
    const [senderEmail, setSenderEmail] = useState("");
    const [senderPhone, setSenderPhone] = useState("");
    const [senderAddress, setSenderAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
    const [showAddressPicker, setShowAddressPicker] = useState(false);
    const [items, setItems] = useState<ShipmentItem[]>([{ ...emptyItem }]);
    const [currency, setCurrency] = useState("USD");
    const [weightUnit, setWeightUnit] = useState("lbs");

    // Client autocomplete
    const [clientQuery, setClientQuery] = useState("");
    const [showClientDropdown, setShowClientDropdown] = useState(false);
    const clientInputRef = useRef<HTMLInputElement>(null);

    // New client modal
    const [showClientModal, setShowClientModal] = useState(false);
    const [clientForm, setClientForm] = useState<ClientForm>(emptyClientForm);
    const [clientSaving, setClientSaving] = useState(false);
    const [clientError, setClientError] = useState("");

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Logo for receipt
    const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchShipments();
        fetchClients();
        fetchLogo();
        fetchWarehouses();
    }, []);

    const fetchShipments = async () => {
        try {
            const res = await fetch("/api/shipments");
            const data = await res.json();
            if (Array.isArray(data)) setShipments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const res = await fetch("/api/clients");
            const data = await res.json();
            if (Array.isArray(data)) setClients(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const res = await fetch("/api/warehouses");
            const data = await res.json();
            if (Array.isArray(data)) setWarehouses(data);
        } catch (err) {
            console.error(err);
        }
    };
    const fetchLogo = async () => {
        try {
            const res = await fetch("/api/settings/logo");
            const data = await res.json();
            if (data.logoUrl) {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0);
                    setLogoDataUrl(canvas.toDataURL("image/png"));
                };
                img.src = data.logoUrl;
            }
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setTrackingId("");
        setOrigin("");
        setDestination("");
        setWeight("");
        setClientName("");
        setFormStatus("PENDING");
        setSenderName("");
        setSenderEmail("");
        setSenderPhone("");
        setSenderAddress("");
        setNotes("");
        setItems([{ ...emptyItem }]);
        setClientQuery("");
        setSelectedWarehouseId("");
        setShowAddressPicker(false);
        setCurrency("USD");
        setWeightUnit("lbs");
        setError("");
    };

    const openCreateModal = () => {
        setEditingShipment(null);
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (s: Shipment) => {
        setEditingShipment(s);
        setTrackingId(s.trackingId);
        setOrigin(s.origin);
        setDestination(s.destination);
        setWeight(String(s.weight));
        setClientName(s.clientName);
        setClientQuery(s.clientName);
        setFormStatus(s.status);
        setSenderName(s.senderName);
        setSenderEmail(s.senderEmail);
        setSenderPhone(s.senderPhone);
        setSenderAddress(s.senderAddress);
        setNotes(s.notes);
        setItems(s.items.length > 0 ? s.items.map(i => ({ ...i })) : [{ ...emptyItem }]);
        setSelectedWarehouseId((s as any).warehouseId || "");
        setError("");
        setShowModal(true);
    };

    const updateStatus = async (id: string, status: string) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`/api/shipments/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                const updated = await res.json();
                setShipments((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleSave = async () => {
        if (!trackingId || !destination || !clientName) {
            setError("Tracking ID, destination, and client are required.");
            return;
        }
        // Validate items
        const validItems = items.filter(i => i.description.trim());
        if (validItems.length === 0) {
            setError("At least one item with a description is required.");
            return;
        }

        setSaving(true);
        setError("");
        // Derive origin from selected warehouse
        const selectedWh = warehouses.find(w => w.id === selectedWarehouseId);
        const derivedOrigin = selectedWh
            ? [selectedWh.city, selectedWh.province].filter(Boolean).join(", ") || selectedWh.address
            : origin || "";

        const payload = {
            trackingId, origin: derivedOrigin, destination, weight, clientName,
            status: formStatus, senderName, senderEmail, senderPhone, senderAddress, notes,
            items: validItems,
            warehouseId: selectedWarehouseId || null,
        };

        try {
            if (editingShipment) {
                const res = await fetch(`/api/shipments/${editingShipment.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    const updated = await res.json();
                    setShipments((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
                    setShowModal(false);
                } else {
                    const err = await res.json();
                    setError(err.error || "Failed to update");
                }
            } else {
                const res = await fetch("/api/shipments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    const created = await res.json();
                    setShipments((prev) => [created, ...prev]);
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
            const res = await fetch(`/api/shipments/${id}`, { method: "DELETE" });
            if (res.ok) {
                setShipments((prev) => prev.filter((s) => s.id !== id));
                setDeleteConfirm(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Items management
    const addItem = () => setItems([...items, { ...emptyItem }]);
    const removeItem = (idx: number) => {
        if (items.length <= 1) return;
        setItems(items.filter((_, i) => i !== idx));
    };
    const updateItem = (idx: number, field: keyof ShipmentItem, value: string | number) => {
        setItems(items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
    };

    // Client autocomplete
    const filteredClients = clients.filter((c) =>
        c.name.toLowerCase().includes(clientQuery.toLowerCase())
    );

    const filteredShipments = shipments.filter((s) => {
        const q = search.toLowerCase();
        const matchesSearch = !q ||
            s.trackingId.toLowerCase().includes(q) ||
            s.clientName.toLowerCase().includes(q) ||
            s.origin.toLowerCase().includes(q) ||
            s.destination.toLowerCase().includes(q);
        const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const selectClient = (name: string) => {
        setClientName(name);
        setClientQuery(name);
        setShowClientDropdown(false);
        // Auto-fill destination with default address
        const client = clients.find(c => c.name === name);
        if (client?.addresses?.length) {
            const defaultAddr = client.addresses.find(a => a.isDefault) || client.addresses[0];
            const formatted = [defaultAddr.street, defaultAddr.city, defaultAddr.province, defaultAddr.postalCode].filter(Boolean).join(", ");
            setDestination(formatted);
        }
    };

    const selectWarehouse = (id: string) => {
        setSelectedWarehouseId(id);
        const wh = warehouses.find(w => w.id === id);
        if (wh) {
            setSenderName(wh.contact || wh.name);
            setSenderEmail(wh.email);
            setSenderPhone(wh.phone);
            const addr = [wh.address, wh.city, wh.province, wh.postalCode].filter(Boolean).join(", ");
            setSenderAddress(addr);
            setOrigin([wh.city, wh.province].filter(Boolean).join(", ") || wh.address);
        } else {
            setSenderName("");
            setSenderEmail("");
            setSenderPhone("");
            setSenderAddress("");
        }
    };

    const getSelectedClientAddresses = (): Address[] => {
        const client = clients.find(c => c.name === clientName);
        return client?.addresses || [];
    };

    const pickClientAddress = (addr: Address) => {
        const formatted = [addr.street, addr.city, addr.province, addr.postalCode].filter(Boolean).join(", ");
        setDestination(formatted);
        setShowAddressPicker(false);
    };

    const handleClientQueryChange = (val: string) => {
        setClientQuery(val);
        setClientName(val);
        setShowClientDropdown(true);
    };

    const openClientModal = (prefillName: string) => {
        setClientForm({ ...emptyClientForm, name: prefillName });
        setClientError("");
        setShowClientModal(true);
    };

    const handleCreateClient = async () => {
        if (!clientForm.name) {
            setClientError("Client name is required.");
            return;
        }
        setClientSaving(true);
        setClientError("");
        try {
            const res = await fetch("/api/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(clientForm),
            });
            if (res.ok) {
                const newClient = await res.json();
                setClients((prev) => [...prev, newClient].sort((a, b) => a.name.localeCompare(b.name)));
                selectClient(newClient.name);
                setShowClientModal(false);
            } else {
                const err = await res.json();
                setClientError(err.error || "Failed to create client");
            }
        } catch {
            setClientError("Network error");
        } finally {
            setClientSaving(false);
        }
    };

    // ─── PDF Receipt ───
    const generateReceipt = (shipment: Shipment) => {
        const doc = new jsPDF();
        const pw = doc.internal.pageSize.getWidth();
        const margin = 15;
        const contentW = pw - margin * 2;
        let y = 15;

        const black: [number, number, number] = [20, 20, 20];
        const gray: [number, number, number] = [110, 110, 110];
        const lightBg: [number, number, number] = [247, 247, 247];
        const yellow: [number, number, number] = [250, 204, 21];
        const headerBg: [number, number, number] = [30, 30, 30];
        const white: [number, number, number] = [255, 255, 255];

        // ── Header Bar ──
        doc.setFillColor(...headerBg);
        doc.rect(0, 0, pw, 40, "F");

        if (logoDataUrl) {
            try { doc.addImage(logoDataUrl, "PNG", margin, 5, 30, 30); } catch { /* skip */ }
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...white);
            doc.text("Shipswipe Logistics", margin + 35, 18);
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(200, 200, 200);
            doc.text("SHIPMENT RECEIPT", margin + 35, 26);
        } else {
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...white);
            doc.text("Shipswipe Logistics", margin, 20);
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(200, 200, 200);
            doc.text("SHIPMENT RECEIPT", margin, 28);
        }

        // Right side: Receipt # + Date
        doc.setFontSize(9);
        doc.setTextColor(200, 200, 200);
        doc.text(`Receipt #${shipment.trackingId}`, pw - margin, 18, { align: "right" });
        doc.text(`Date: ${new Date().toLocaleDateString()}`, pw - margin, 26, { align: "right" });

        y = 50;

        // ── Yellow accent bar ──
        doc.setFillColor(...yellow);
        doc.rect(margin, y, contentW, 2, "F");
        y += 12;

        // ── Tracking + Status ──
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...black);
        doc.text(`Tracking ID: ${shipment.trackingId}`, margin, y);
        const statusLabel = statusOptions.find(s => s.value === shipment.status)?.label || shipment.status;
        doc.setFontSize(10);
        doc.setTextColor(...gray);
        doc.text(`Status: ${statusLabel}`, pw - margin, y, { align: "right" });
        y += 12;

        // ── Sender + Receiver cards ──
        const cardW = (contentW - 10) / 2;

        // Sender card
        doc.setFillColor(...lightBg);
        doc.roundedRect(margin, y, cardW, 40, 2, 2, "F");
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...gray);
        doc.text("FROM (SENDER)", margin + 6, y + 8);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...black);
        doc.text(shipment.senderName || "—", margin + 6, y + 16);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...gray);
        if (shipment.senderPhone) doc.text(shipment.senderPhone, margin + 6, y + 22);
        if (shipment.senderEmail) doc.text(shipment.senderEmail, margin + 6, y + 27);
        if (shipment.senderAddress) doc.text(shipment.senderAddress, margin + 6, y + 32);

        // Receiver card
        const rxX = margin + cardW + 10;
        doc.setFillColor(...lightBg);
        doc.roundedRect(rxX, y, cardW, 40, 2, 2, "F");
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...gray);
        doc.text("TO (CLIENT)", rxX + 6, y + 8);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...black);
        doc.text(shipment.clientName || "—", rxX + 6, y + 16);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...gray);
        // Find client details
        const clientDetails = clients.find(c => c.name === shipment.clientName);
        if (clientDetails?.phone) doc.text(clientDetails.phone, rxX + 6, y + 22);
        if (clientDetails?.email) doc.text(clientDetails.email, rxX + 6, y + 27);
        if (clientDetails?.company) doc.text(clientDetails.company, rxX + 6, y + 32);
        y += 48;

        // ── Route ──
        doc.setFillColor(...lightBg);
        const routeCardW = (contentW - 30) / 2;

        // Origin card
        doc.roundedRect(margin, y, routeCardW, 22, 2, 2, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...gray);
        doc.text("ORIGIN", margin + 5, y + 7);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...black);
        doc.text(shipment.origin || "—", margin + 5, y + 16, { maxWidth: routeCardW - 10 });

        // Arrow icon in center
        const arrowX = margin + routeCardW + 5;
        doc.setFillColor(...yellow);
        doc.circle(arrowX + 10, y + 11, 6, "F");
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...black);
        doc.text("\u2192", arrowX + 7, y + 14);

        // Destination card
        const destX = margin + routeCardW + 30;
        doc.setFillColor(...lightBg);
        doc.roundedRect(destX, y, routeCardW, 22, 2, 2, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...gray);
        doc.text("DESTINATION", destX + 5, y + 7);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...black);
        doc.text(shipment.destination || "—", destX + 5, y + 16, { maxWidth: routeCardW - 10 });
        y += 28;

        // Total weight on its own line
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...gray);
        doc.text(`Total Weight: ${shipment.weight} ${weightUnit}`, margin, y + 4);
        y += 12;

        // ── Items Table ──
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...black);
        doc.text("ITEMS", margin, y);
        y += 6;

        // Table columns: #, Description, SKU, Qty, Weight, Unit $, Total $
        const col = {
            num: margin + 2,
            desc: margin + 14,
            sku: margin + 80,
            qty: margin + 108,
            wt: margin + 128,
            unit: margin + 152,
            total: pw - margin - 2,
        };

        // Table header
        doc.setFillColor(...headerBg);
        doc.rect(margin, y, contentW, 8, "F");
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...white);
        doc.text("NO.", col.num, y + 4);
        doc.text("ITEM DESCRIPTION", col.desc, y + 4);
        doc.text("SKU / REF", col.sku, y + 4);
        doc.text("QTY", col.qty, y + 4);
        doc.text(`WT (${weightUnit.toUpperCase()})`, col.wt, y + 4);
        doc.text("UNIT VAL", col.unit, y + 4);
        doc.text("AMOUNT", col.total, y + 4, { align: "right" });
        y += 10;

        // Table rows
        let grandTotal = 0;
        let totalWeight = 0;
        const tableItems = shipment.items && shipment.items.length > 0 ? shipment.items : [{ description: "General cargo", quantity: 1, weight: shipment.weight, unitValue: 0, sku: "--" }];

        tableItems.forEach((item, i) => {
            const lineTotal = (item.quantity || 1) * (item.unitValue || 0);
            grandTotal += lineTotal;
            totalWeight += (item.weight || 0) * (item.quantity || 1);

            if (i % 2 === 0) {
                doc.setFillColor(250, 250, 250);
                doc.rect(margin, y - 4, contentW, 8, "F");
            }

            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...black);
            doc.text(String(i + 1), col.num, y + 1);
            doc.text(item.description || "--", col.desc, y + 1);
            doc.setTextColor(...gray);
            doc.text(item.sku || "--", col.sku, y + 1);
            doc.setTextColor(...black);
            doc.text(String(item.quantity || 1), col.qty, y + 1);
            doc.text(`${(item.weight || 0).toFixed(1)}`, col.wt, y + 1);
            const currSym = currency === "EUR" ? "\u20ac" : currency === "GBP" ? "\u00a3" : "$";
            doc.text(`${currSym}${(item.unitValue || 0).toFixed(2)}`, col.unit, y + 1);
            doc.setFont("helvetica", "bold");
            doc.text(`${currSym}${lineTotal.toFixed(2)}`, col.total, y + 1, { align: "right" });
            y += 8;
        });

        // Total row
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y - 2, pw - margin, y - 2);
        y += 4;
        doc.setFillColor(...lightBg);
        doc.rect(margin, y - 4, contentW, 10, "F");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...black);
        doc.text("TOTAL", col.desc, y + 2);
        doc.text(`${tableItems.reduce((a, i) => a + (i.quantity || 1), 0)} pcs`, col.qty, y + 2);
        doc.text(`${totalWeight.toFixed(1)} ${weightUnit}`, col.wt, y + 2);
        doc.setTextColor(0, 120, 0);
        doc.setFontSize(10);
        const totalCurrSym = currency === "EUR" ? "\u20ac" : currency === "GBP" ? "\u00a3" : "$";
        doc.text(`${totalCurrSym}${grandTotal.toFixed(2)}`, col.total, y + 2, { align: "right" });
        y += 16;

        // ── Shipment Summary Info ──
        const summaryW = (contentW - 6) / 3;
        doc.setFillColor(...lightBg);
        doc.roundedRect(margin, y, summaryW, 16, 2, 2, "F");
        doc.roundedRect(margin + summaryW + 3, y, summaryW, 16, 2, 2, "F");
        doc.roundedRect(margin + (summaryW + 3) * 2, y, summaryW, 16, 2, 2, "F");

        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...gray);
        doc.text("DECLARED VALUE", margin + 4, y + 6);
        doc.text("PAYMENT TERMS", margin + summaryW + 7, y + 6);
        doc.text("INSURANCE", margin + (summaryW + 3) * 2 + 4, y + 6);

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...black);
        const declaredSym = currency === "EUR" ? "\u20ac" : currency === "GBP" ? "\u00a3" : "$";
        doc.text(`${declaredSym}${grandTotal.toFixed(2)} ${currency}`, margin + 4, y + 12);
        doc.text("Freight Prepaid", margin + summaryW + 7, y + 12);
        doc.text("Standard", margin + (summaryW + 3) * 2 + 4, y + 12);
        y += 24;

        // ── Terms & Conditions Checkboxes ──
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...black);
        doc.text("SHIPMENT TERMS & CONDITIONS", margin, y);
        y += 6;

        const checkboxes = [
            { label: "Goods inspected and accepted in good condition at pickup", checked: true },
            { label: "Shipment contains no prohibited or hazardous materials", checked: true },
            { label: "Carrier liability insurance coverage requested", checked: true },
            { label: "Special handling required (fragile / temperature-sensitive)", checked: false },
        ];

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        checkboxes.forEach(({ label, checked }) => {
            // Draw checkbox square
            doc.setDrawColor(180, 180, 180);
            doc.setLineWidth(0.3);
            doc.rect(margin + 2, y - 3, 3.5, 3.5);
            // Draw checkmark if checked
            if (checked) {
                doc.setDrawColor(20, 20, 20);
                doc.setLineWidth(0.5);
                doc.line(margin + 2.5, y - 1, margin + 3.5, y + 0.2);
                doc.line(margin + 3.5, y + 0.2, margin + 5.2, y - 2.5);
            }
            doc.setTextColor(...black);
            doc.text(label, margin + 8, y);
            y += 6;
        });
        y += 4;

        // ── Notes ──
        if (shipment.notes) {
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...gray);
            doc.text("ADDITIONAL NOTES / SPECIAL INSTRUCTIONS", margin, y);
            y += 5;
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...black);
            const noteLines = doc.splitTextToSize(shipment.notes, contentW);
            doc.text(noteLines, margin, y);
            y += noteLines.length * 4 + 6;
        }

        // ── Signature Blocks ──
        const sigW = (contentW - 20) / 2;

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...gray);
        // doc.text("SENDER / SHIPPER", margin, y);
        doc.text("SENDER / SHIPPER", margin + sigW + 20, y);
        y += 12;

        // Signature lines
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.4);
        // doc.line(margin, y, margin + sigW, y);
        doc.line(margin + sigW + 20, y, margin + sigW * 2 + 20, y);

        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...gray);
        // doc.text("Signature", margin, y + 4);
        doc.text("Signature", margin + sigW + 20, y + 4);
        y += 14;

        // Name + Date lines
        // doc.line(margin, y, margin + sigW * 0.55, y);
        // doc.line(margin + sigW * 0.6, y, margin + sigW, y);
        // doc.line(margin + sigW + 20, y, margin + sigW + 20 + sigW * 0.55, y);
        // doc.line(margin + sigW + 20 + sigW * 0.6, y, margin + sigW * 2 + 20, y);

        // doc.text("Print Name", margin, y + 4);
        // doc.text("Date", margin + sigW * 0.6, y + 4);
        // doc.text("Print Name", margin + sigW + 20, y + 4);
        // doc.text("Date", margin + sigW + 20 + sigW * 0.6, y + 4);
        // y += 14;

        // ── Footer ──
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, y, pw - margin, y);
        y += 5;
        doc.setFontSize(6.5);
        doc.setTextColor(...gray);
        doc.text("By signing this receipt, both parties acknowledge the shipment details above are accurate.", pw / 2, y, { align: "center" });
        doc.text("Shipswipe Logistics  |  shipswipe.com  |  All rights reserved", pw / 2, y + 4, { align: "center" });
        doc.text(`Document generated on ${new Date().toLocaleString()}`, pw / 2, y + 8, { align: "center" });

        doc.save(`receipt-${shipment.trackingId}.pdf`);
    };

    // ─── Calculated total weight from items ───
    const calcTotalWeight = () => {
        return items.reduce((sum, it) => sum + (Number(it.weight) || 0) * (Number(it.quantity) || 1), 0);
    };

    useEffect(() => {
        setWeight(String(calcTotalWeight().toFixed(1)));
    }, [items]);

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-black">All Shipments</h1>
                    <p className="text-sm text-black/40 mt-1">
                        Manage shipments — create, update, or delete
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-200 active:scale-95 shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Shipment
                </button>
            </div>

            <div className="card">
                {loading ? (
                    <div className="space-y-4">
                        <SkeletonLoader className="h-12 w-full" count={6} />
                    </div>
                ) : (
                    <>
                        {/* Filter Bar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
                            <div className="relative flex-1 w-full sm:max-w-xs">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by ID, client, origin, destination..."
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
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {[{ value: "ALL", label: "All" }, ...statusOptions].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setStatusFilter(opt.value)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${statusFilter === opt.value
                                            ? "bg-yellow-400 text-black shadow-sm"
                                            : "bg-black/[0.03] text-black/40 hover:bg-black/[0.06] hover:text-black/60"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            <span className="text-xs text-black/30 ml-auto">
                                {filteredShipments.length} of {shipments.length}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/5">
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Tracking ID</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Client</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Route</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Items</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Weight</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Status</th>
                                        <th className="text-left py-3 px-4 text-xs text-black/40 uppercase tracking-wider font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredShipments.map((shipment, i) => (
                                        <motion.tr
                                            key={shipment.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors"
                                        >
                                            <td className="py-3 px-4 font-mono font-medium text-black">{shipment.trackingId}</td>
                                            <td className="py-3 px-4 text-black/60">{shipment.clientName}</td>
                                            <td className="py-3 px-4 text-black/60 text-xs">
                                                {shipment.origin} → {shipment.destination}
                                            </td>
                                            <td className="py-3 px-4 text-black/60">
                                                <span className="inline-flex items-center gap-1 text-xs bg-black/[0.04] px-2 py-0.5 rounded-md">
                                                    {shipment.items?.length || 0}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-black/60">{shipment.weight} kg</td>
                                            <td className="py-3 px-4">
                                                <select
                                                    value={shipment.status}
                                                    onChange={(e) => updateStatus(shipment.id, e.target.value)}
                                                    disabled={updatingId === shipment.id}
                                                    className="text-xs bg-black/[0.03] border border-black/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 disabled:opacity-50 cursor-pointer"
                                                >
                                                    {statusOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    <button onClick={() => generateReceipt(shipment)} className="p-1.5 rounded-lg hover:bg-blue-50 text-black/40 hover:text-blue-600 transition-colors" title="Download Receipt">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                                    </button>
                                                    <button onClick={() => openEditModal(shipment)} className="p-1.5 rounded-lg hover:bg-yellow-400/10 text-black/40 hover:text-yellow-600 transition-colors" title="Edit">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    {deleteConfirm === shipment.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <button onClick={() => handleDelete(shipment.id)} className="text-[10px] px-2 py-1 bg-red-500 text-white rounded font-medium">Confirm</button>
                                                            <button onClick={() => setDeleteConfirm(null)} className="text-[10px] px-2 py-1 bg-black/5 text-black/50 rounded font-medium">Cancel</button>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => setDeleteConfirm(shipment.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-black/40 hover:text-red-500 transition-colors" title="Delete">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {shipments.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-black/30 text-sm">
                                                No shipments found. Click &quot;New Shipment&quot; to add one.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* ──── SHIPMENT CREATE / EDIT MODAL ──── */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm px-4 py-8 overflow-y-auto"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 my-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold text-black mb-6">
                                {editingShipment ? "Edit Shipment" : "New Shipment"}
                            </h2>

                            {error && (
                                <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
                            )}

                            <div className="space-y-6">
                                {/* Section: Basic Info */}
                                <div>
                                    <h3 className="text-xs font-bold text-black/40 uppercase tracking-wider mb-3">Shipment Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-black/50 mb-1.5">Tracking ID *</label>
                                            <input type="text" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} className="input-field" placeholder="e.g. 583941720468" />
                                        </div>
                                        {/* Client autocomplete */}
                                        <div className="relative">
                                            <label className="block text-xs font-medium text-black/50 mb-1.5">Client *</label>
                                            <input
                                                ref={clientInputRef}
                                                type="text"
                                                value={clientQuery}
                                                onChange={(e) => handleClientQueryChange(e.target.value)}
                                                onFocus={() => setShowClientDropdown(true)}
                                                className="input-field"
                                                placeholder="Search or add client..."
                                            />
                                            <AnimatePresence>
                                                {showClientDropdown && clientQuery.length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -4 }}
                                                        className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-black/10 shadow-lg z-50 max-h-48 overflow-y-auto"
                                                    >
                                                        {filteredClients.length > 0 ? (
                                                            filteredClients.map((c) => (
                                                                <button key={c.id} onClick={() => selectClient(c.name)} className="w-full text-left px-4 py-2.5 hover:bg-yellow-400/5 transition-colors">
                                                                    <p className="text-sm font-medium text-black">{c.name}</p>
                                                                    <p className="text-[10px] text-black/30">{c.company || c.email}</p>
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="p-4 text-center">
                                                                <p className="text-sm text-black/40 mb-2">No client found</p>
                                                                <button onClick={() => openClientModal(clientQuery)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-yellow-400 text-black text-xs font-semibold rounded-lg hover:bg-yellow-300">
                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                                    Add &quot;{clientQuery}&quot;
                                                                </button>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div>
                                            <label className="block text-xs font-medium text-black/50 mb-1.5">Destination *</label>
                                            {getSelectedClientAddresses().length > 0 ? (
                                                <select
                                                    value={destination}
                                                    onChange={(e) => setDestination(e.target.value)}
                                                    className="input-field cursor-pointer"
                                                >
                                                    <option value="">— Select an address —</option>
                                                    {getSelectedClientAddresses().map((addr) => {
                                                        const formatted = [addr.street, addr.city, addr.province, addr.postalCode].filter(Boolean).join(", ");
                                                        return (
                                                            <option key={addr.id} value={formatted}>
                                                                {addr.label ? `${addr.label} — ` : ""}{formatted}{addr.isDefault ? " ★" : ""}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            ) : (
                                                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className="input-field" placeholder="Select a client first to choose an address" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-xs font-medium text-black/50 mb-1.5">Total Weight ({weightUnit}) — auto-calculated</label>
                                            <input type="number" value={weight} readOnly className="input-field bg-black/[0.02] cursor-not-allowed" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-black/50 mb-1.5">Status</label>
                                            <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)} className="input-field cursor-pointer">
                                                {statusOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Sender / Warehouse */}
                                <div>
                                    <h3 className="text-xs font-bold text-black/40 uppercase tracking-wider mb-3">Sender / Warehouse</h3>
                                    <div>
                                        <label className="block text-xs font-medium text-black/50 mb-1.5">Select Warehouse</label>
                                        <select
                                            value={selectedWarehouseId}
                                            onChange={(e) => selectWarehouse(e.target.value)}
                                            className="input-field cursor-pointer"
                                        >
                                            <option value="">— Choose a warehouse —</option>
                                            {warehouses.map((w) => (
                                                <option key={w.id} value={w.id}>{w.name} — {[w.city, w.province].filter(Boolean).join(", ")}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-3">
                                        <div>
                                            <label className="block text-xs font-medium text-black/50 mb-1.5">Sender Name</label>
                                            <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} className="input-field" placeholder="Auto-filled from warehouse" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-black/50 mb-1.5">Sender Email</label>
                                            <input type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} className="input-field" placeholder="Auto-filled" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-3">
                                        <div>
                                            <label className="block text-xs font-medium text-black/50 mb-1.5">Sender Phone</label>
                                            <input type="tel" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} className="input-field" placeholder="Auto-filled" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-black/50 mb-1.5">Sender Address</label>
                                            <input type="text" value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} className="input-field" placeholder="Auto-filled" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Items */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xs font-bold text-black/40 uppercase tracking-wider">
                                            Items *
                                            <span className="text-black/25 ml-2 normal-case">({items.length} item{items.length > 1 ? "s" : ""})</span>
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] text-black/30">Currency</span>
                                                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="text-xs bg-black/[0.03] border border-black/10 rounded-lg px-2 py-1 focus:outline-none focus:border-yellow-400 cursor-pointer">
                                                    <option value="USD">USD $</option>
                                                    <option value="CAD">CAD $</option>
                                                    <option value="EUR">EUR €</option>
                                                    <option value="GBP">GBP £</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] text-black/30">Weight</span>
                                                <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} className="text-xs bg-black/[0.03] border border-black/10 rounded-lg px-2 py-1 focus:outline-none focus:border-yellow-400 cursor-pointer">
                                                    <option value="lbs">lbs</option>
                                                    <option value="kg">kg</option>
                                                </select>
                                            </div>
                                            <button
                                                onClick={addItem}
                                                className="flex items-center gap-1 text-xs font-semibold text-yellow-600 hover:text-yellow-500 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                Add Item
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {items.map((item, idx) => (
                                            <div key={idx} className="bg-black/[0.02] border border-black/5 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-xs font-bold text-black/30">Item #{idx + 1}</span>
                                                    {items.length > 1 && (
                                                        <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-500 transition-colors" title="Remove item">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-5 gap-3">
                                                    <div className="col-span-2">
                                                        <label className="block text-[10px] font-medium text-black/40 mb-1">Description *</label>
                                                        <input type="text" value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} className="input-field !text-sm" placeholder="Item name" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-medium text-black/40 mb-1">SKU</label>
                                                        <input type="text" value={item.sku} onChange={(e) => updateItem(idx, "sku", e.target.value)} className="input-field !text-sm" placeholder="SKU-001" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-medium text-black/40 mb-1">Qty</label>
                                                        <input type="number" value={item.quantity || ""} onChange={(e) => updateItem(idx, "quantity", e.target.value === "" ? 0 : parseInt(e.target.value))} className="input-field !text-sm" min="1" placeholder="1" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-medium text-black/40 mb-1">Weight ({weightUnit})</label>
                                                        <input type="number" value={item.weight || ""} onChange={(e) => updateItem(idx, "weight", e.target.value === "" ? 0 : parseFloat(e.target.value))} className="input-field !text-sm" min="0" step="0.1" placeholder="0" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-5 gap-3 mt-3">
                                                    <div className="col-span-2">
                                                        <label className="block text-[10px] font-medium text-black/40 mb-1">Unit Value ({currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$"})</label>
                                                        <input type="number" value={item.unitValue || ""} onChange={(e) => updateItem(idx, "unitValue", e.target.value === "" ? 0 : parseFloat(e.target.value))} className="input-field !text-sm" min="0" step="0.01" placeholder="0.00" />
                                                    </div>
                                                    <div className="col-span-3 flex items-end">
                                                        <p className="text-xs text-black/30 pb-2">
                                                            Line total: <span className="font-bold text-black">{currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$"}{((item.quantity || 1) * (item.unitValue || 0)).toFixed(2)}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Items summary */}
                                    <div className="mt-3 flex items-center justify-between px-1 text-xs text-black/40">
                                        <span>Total weight: {calcTotalWeight().toFixed(1)} {weightUnit}</span>
                                        <span className="font-bold text-black">
                                            Grand total: {currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$"}{items.reduce((sum, it) => sum + (Number(it.quantity) || 1) * (Number(it.unitValue) || 0), 0).toFixed(2)} {currency}
                                        </span>
                                    </div>
                                </div>

                                {/* Section: Notes */}
                                <div>
                                    <label className="block text-xs font-medium text-black/50 mb-1.5">Notes</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="input-field resize-none"
                                        rows={2}
                                        placeholder="Special instructions, handling notes..."
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-8">
                                <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
                                    {saving ? "Saving..." : editingShipment ? "Save Changes" : "Create Shipment"}
                                </button>
                                <button onClick={() => setShowModal(false)} className="px-6 py-3 bg-black/5 text-black/60 font-medium rounded-xl hover:bg-black/10 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ──── NEW CLIENT MODAL ──── */}
            <AnimatePresence>
                {showClientModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
                        onClick={() => setShowClientModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-lg font-bold text-black mb-6">Register New Client</h2>

                            {clientError && (
                                <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{clientError}</div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-black/50 mb-1.5">Client Name *</label>
                                    <input type="text" value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} className="input-field" placeholder="Client name" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-black/50 mb-1.5">Company</label>
                                    <input type="text" value={clientForm.company} onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })} className="input-field" placeholder="Company name" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-black/50 mb-1.5">Email</label>
                                        <input type="email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} className="input-field" placeholder="email@company.com" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-black/50 mb-1.5">Phone</label>
                                        <input type="tel" value={clientForm.phone} onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })} className="input-field" placeholder="514-555-0000" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-8">
                                <button onClick={handleCreateClient} disabled={clientSaving} className="flex-1 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
                                    {clientSaving ? "Creating..." : "Add Client"}
                                </button>
                                <button onClick={() => setShowClientModal(false)} className="px-6 py-3 bg-black/5 text-black/60 font-medium rounded-xl hover:bg-black/10 transition-colors">
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
