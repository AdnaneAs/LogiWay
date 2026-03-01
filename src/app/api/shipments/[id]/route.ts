import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            status, trackingId, origin, destination, weight, clientName,
            senderName, senderEmail, senderPhone, senderAddress, notes,
            items, warehouseId, currency, weightUnit
        } = body;

        const updateData: any = {};

        if (status) {
            const validStatuses = ["PENDING", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"];
            if (!validStatuses.includes(status)) {
                return NextResponse.json(
                    { error: "Invalid status" },
                    { status: 400 }
                );
            }
            updateData.status = status;
        }
        if (trackingId) updateData.trackingId = trackingId;
        if (origin) updateData.origin = origin;
        if (destination) updateData.destination = destination;
        if (weight !== undefined) updateData.weight = parseFloat(weight);
        if (clientName) updateData.clientName = clientName;
        if (senderName !== undefined) updateData.senderName = senderName;
        if (senderEmail !== undefined) updateData.senderEmail = senderEmail;
        if (senderPhone !== undefined) updateData.senderPhone = senderPhone;
        if (senderAddress !== undefined) updateData.senderAddress = senderAddress;
        if (notes !== undefined) updateData.notes = notes;
        if (currency !== undefined) updateData.currency = currency;
        if (weightUnit !== undefined) updateData.weightUnit = weightUnit;
        if (warehouseId !== undefined) updateData.warehouseId = warehouseId || null;

        // If items are provided, replace all items
        if (items && Array.isArray(items)) {
            // Delete existing items
            await prisma.shipmentItem.deleteMany({
                where: { shipmentId: params.id },
            });

            // Create new items
            updateData.items = {
                create: items.map((item: any) => ({
                    description: item.description,
                    quantity: parseInt(item.quantity) || 1,
                    weight: parseFloat(item.weight) || 0,
                    unitValue: parseFloat(item.unitValue) || 0,
                    sku: item.sku || "",
                })),
            };
        }

        const shipment = await prisma.shipment.update({
            where: { id: params.id },
            data: updateData,
            include: { items: true },
        });

        return NextResponse.json(shipment);
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

export async function DELETE(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.shipment.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
