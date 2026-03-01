import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const addresses = await prisma.address.findMany({
            where: { clientId: params.id },
            orderBy: { createdAt: "asc" },
        });
        return NextResponse.json(addresses);
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { label, street, city, province, postalCode, country, isDefault } = body;

        if (!street || !city) {
            return NextResponse.json({ error: "Street and city are required" }, { status: 400 });
        }

        // If setting as default, unset all others first
        if (isDefault) {
            await prisma.address.updateMany({
                where: { clientId: params.id },
                data: { isDefault: false },
            });
        }

        // If this is the first address, make it default
        const existingCount = await prisma.address.count({ where: { clientId: params.id } });

        const address = await prisma.address.create({
            data: {
                label: label || "",
                street,
                city,
                province: province || "",
                postalCode: postalCode || "",
                country: country || "Canada",
                isDefault: isDefault || existingCount === 0,
                clientId: params.id,
            },
        });

        return NextResponse.json(address, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
