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
        const clients = await prisma.client.findMany({
            orderBy: { name: "asc" },
            include: { addresses: { orderBy: { createdAt: "asc" } } },
        });
        return NextResponse.json(clients);
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
        const { name, email, phone, company } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Client name is required" },
                { status: 400 }
            );
        }

        const client = await prisma.client.create({
            data: {
                name,
                email: email || "",
                phone: phone || "",
                company: company || "",
            },
        });

        return NextResponse.json(client, { status: 201 });
    } catch (error: any) {
        if (error?.code === "P2002") {
            return NextResponse.json(
                { error: "Client name already exists" },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
