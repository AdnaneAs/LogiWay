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
        const warehouses = await prisma.warehouse.findMany({
            orderBy: { name: "asc" },
        });
        return NextResponse.json(warehouses);
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, address, city, province, postalCode, country, phone, email, contact } = body;

        if (!name || !address) {
            return NextResponse.json({ error: "Name and address are required" }, { status: 400 });
        }

        const warehouse = await prisma.warehouse.create({
            data: {
                name,
                address,
                city: city || "",
                province: province || "",
                postalCode: postalCode || "",
                country: country || "Canada",
                phone: phone || "",
                email: email || "",
                contact: contact || "",
            },
        });

        return NextResponse.json(warehouse, { status: 201 });
    } catch (error: any) {
        if (error?.code === "P2002") {
            return NextResponse.json({ error: "Warehouse name already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
