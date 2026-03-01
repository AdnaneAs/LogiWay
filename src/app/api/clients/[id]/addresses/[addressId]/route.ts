import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string; addressId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { label, street, city, province, postalCode, country, isDefault } = body;

        // If setting as default, unset all others first
        if (isDefault) {
            // Find the address to get clientId
            const existing = await prisma.address.findUnique({ where: { id: params.addressId } });
            if (existing) {
                await prisma.address.updateMany({
                    where: { clientId: existing.clientId },
                    data: { isDefault: false },
                });
            }
        }

        const updateData: any = {};
        if (label !== undefined) updateData.label = label;
        if (street !== undefined) updateData.street = street;
        if (city !== undefined) updateData.city = city;
        if (province !== undefined) updateData.province = province;
        if (postalCode !== undefined) updateData.postalCode = postalCode;
        if (country !== undefined) updateData.country = country;
        if (isDefault !== undefined) updateData.isDefault = isDefault;

        const address = await prisma.address.update({
            where: { id: params.addressId },
            data: updateData,
        });

        return NextResponse.json(address);
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: { id: string; addressId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.address.delete({ where: { id: params.addressId } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
