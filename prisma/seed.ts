import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Seed admin user
    const hashedPassword = await bcrypt.hash("ImAdminhehe123", 12);

    await prisma.user.upsert({
        where: { email: "jocker@firstMelion.com" },
        update: {},
        create: {
            email: "jocker@firstMelion.com",
            name: "jocker",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    // Seed sample shipments with items
    const shipmentsData = [
        {
            trackingId: "583941720468",
            origin: "Montreal, QC",
            destination: "Toronto, ON",
            status: "IN_TRANSIT" as const,
            weight: 15.5,
            clientName: "Maple Industries",
            senderName: "Jean Tremblay",
            senderEmail: "jean@tremblay-shipping.ca",
            senderPhone: "514-555-0110",
            senderAddress: "450 Rue Saint-Jacques, Montreal, QC",
            items: [
                { description: "Industrial valves", quantity: 10, weight: 1.2, unitValue: 45.00, sku: "IV-2024" },
                { description: "Pipe fittings assortment", quantity: 5, weight: 0.7, unitValue: 22.50, sku: "PF-1010" },
            ],
        },
        {
            trackingId: "907316482159",
            origin: "Vancouver, BC",
            destination: "Calgary, AB",
            status: "PENDING" as const,
            weight: 42.0,
            clientName: "Pacific Freight Co.",
            senderName: "Sarah Chen",
            senderEmail: "sarah@westcoast-supply.com",
            senderPhone: "604-555-0220",
            senderAddress: "1200 Waterfront Rd, Vancouver, BC",
            items: [
                { description: "Electronics components", quantity: 200, weight: 0.15, unitValue: 12.99, sku: "EC-5500" },
                { description: "Circuit boards", quantity: 50, weight: 0.2, unitValue: 35.00, sku: "CB-3300" },
            ],
        },
        {
            trackingId: "214785903624",
            origin: "Ottawa, ON",
            destination: "Halifax, NS",
            status: "DELIVERED" as const,
            weight: 8.2,
            clientName: "Atlantic Supply",
            senderName: "Mike O'Brien",
            senderEmail: "mike@govcontracts.ca",
            senderPhone: "613-555-0330",
            senderAddress: "88 Wellington St, Ottawa, ON",
            items: [
                { description: "Office supplies bundle", quantity: 3, weight: 2.5, unitValue: 89.99, sku: "OS-7700" },
            ],
        },
        {
            trackingId: "769024815337",
            origin: "Winnipeg, MB",
            destination: "Edmonton, AB",
            status: "OUT_FOR_DELIVERY" as const,
            weight: 23.7,
            clientName: "Prairie Logistics",
            senderName: "Anil Patel",
            senderEmail: "anil@prairiemfg.ca",
            senderPhone: "204-555-0440",
            senderAddress: "300 Portage Ave, Winnipeg, MB",
            items: [
                { description: "Agricultural sensors", quantity: 15, weight: 1.0, unitValue: 120.00, sku: "AS-9001" },
                { description: "Mounting hardware kit", quantity: 15, weight: 0.58, unitValue: 18.50, sku: "MH-4400" },
            ],
        },
        {
            trackingId: "430618972054",
            origin: "Quebec City, QC",
            destination: "Montreal, QC",
            status: "IN_TRANSIT" as const,
            weight: 5.0,
            clientName: "Fleuve Express",
            senderName: "Marie Gagnon",
            senderEmail: "marie@artisanat-qc.ca",
            senderPhone: "418-555-0550",
            senderAddress: "12 Rue du Petit-Champlain, Quebec, QC",
            items: [
                { description: "Artisan maple products", quantity: 20, weight: 0.25, unitValue: 15.00, sku: "AMP-100" },
            ],
        },
    ];

    for (const data of shipmentsData) {
        const { items, ...shipmentData } = data;
        const existing = await prisma.shipment.findUnique({
            where: { trackingId: shipmentData.trackingId },
        });
        if (!existing) {
            await prisma.shipment.create({
                data: {
                    ...shipmentData,
                    items: {
                        create: items,
                    },
                },
            });
        }
    }

    // Seed clients
    const clients = [
        { name: "Maple Industries", email: "contact@maple-ind.com", phone: "514-555-0100", company: "Maple Industries Ltd." },
        { name: "Pacific Freight Co.", email: "ops@pacificfreight.ca", phone: "604-555-0200", company: "Pacific Freight Co." },
        { name: "Atlantic Supply", email: "info@atlanticsupply.ca", phone: "902-555-0300", company: "Atlantic Supply Inc." },
        { name: "Prairie Logistics", email: "dispatch@prairie-log.ca", phone: "204-555-0400", company: "Prairie Logistics Corp." },
        { name: "Fleuve Express", email: "bonjour@fleuve.ca", phone: "418-555-0500", company: "Fleuve Express SARL" },
    ];

    for (const cl of clients) {
        await prisma.client.upsert({
            where: { name: cl.name },
            update: {},
            create: cl,
        });
    }

    console.log("Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
