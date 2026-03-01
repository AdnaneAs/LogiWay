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
        const { name, address, city, province, postalCode, country, phone, email, contact } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (address !== undefined) updateData.address = address;
        if (city !== undefined) updateData.city = city;
        if (province !== undefined) updateData.province = province;
        if (postalCode !== undefined) updateData.postalCode = postalCode;
        if (country !== undefined) updateData.country = country;
        if (phone !== undefined) updateData.phone = phone;
        if (email !== undefined) updateData.email = email;
        if (contact !== undefined) updateData.contact = contact;

        const warehouse = await prisma.warehouse.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json(warehouse);
    } catch (error: any) {
        if (error?.code === "P2002") {
            return NextResponse.json({ error: "Warehouse name already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
        await prisma.warehouse.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
