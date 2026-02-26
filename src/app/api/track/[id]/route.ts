import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const shipment = await prisma.shipment.findUnique({
            where: { trackingId: params.id },
        });

        if (!shipment) {
            return NextResponse.json(
                { error: "Shipment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(shipment);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
