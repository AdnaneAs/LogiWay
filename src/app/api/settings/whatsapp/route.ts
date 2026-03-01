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
        const settings = await prisma.setting.findMany({
            where: { key: { in: ["whatsappNumber", "supportEmail"] } },
        });
        const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
        return NextResponse.json({
            whatsappNumber: map.whatsappNumber || "",
            supportEmail: map.supportEmail || "",
        });
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
        const { whatsappNumber, supportEmail } = await request.json();

        await Promise.all([
            prisma.setting.upsert({
                where: { key: "whatsappNumber" },
                update: { value: whatsappNumber || "" },
                create: { key: "whatsappNumber", value: whatsappNumber || "" },
            }),
            prisma.setting.upsert({
                where: { key: "supportEmail" },
                update: { value: supportEmail || "" },
                create: { key: "supportEmail", value: supportEmail || "" },
            }),
        ]);

        return NextResponse.json({ whatsappNumber: whatsappNumber || "", supportEmail: supportEmail || "" });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
