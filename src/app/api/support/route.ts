import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
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
        return NextResponse.json({ whatsappNumber: "", supportEmail: "" });
    }
}
