import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const shipments = await prisma.shipment.findMany({
            orderBy: { createdAt: "desc" },
            include: { items: true },
        });
        return NextResponse.json(shipments);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            trackingId, origin, destination, weight, clientName, status,
            senderName, senderEmail, senderPhone, senderAddress, notes,
            items, warehouseId, currency, weightUnit
        } = body;

        if (!trackingId || !origin || !destination || !clientName) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: "At least one item is required" },
                { status: 400 }
            );
        }

        const shipment = await prisma.shipment.create({
            data: {
                trackingId,
                origin,
                destination,
                weight: parseFloat(weight) || 0,
                clientName,
                status: status || "PENDING",
                senderName: senderName || "",
                senderEmail: senderEmail || "",
                senderPhone: senderPhone || "",
                senderAddress: senderAddress || "",
                notes: notes || "",
                currency: currency || "USD",
                weightUnit: weightUnit || "lbs",
                warehouseId: warehouseId || null,
                items: {
                    create: items.map((item: any) => ({
                        description: item.description,
                        quantity: parseInt(item.quantity) || 1,
                        weight: parseFloat(item.weight) || 0,
                        unitValue: parseFloat(item.unitValue) || 0,
                        sku: item.sku || "",
                    })),
                },
            },
            include: { items: true },
        });

        return NextResponse.json(shipment, { status: 201 });
    } catch (error: any) {
        if (error?.code === "P2002") {
            return NextResponse.json(
                { error: "Tracking ID already exists" },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
