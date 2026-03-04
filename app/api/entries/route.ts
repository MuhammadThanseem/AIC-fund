export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "app/data");
const filePath = path.join(dataDir, "entries.csv");

function ensureFile() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // Updated header with all fields
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(
            filePath,
            "BoxNumber,CustomerName,MobileNumber,CollectionDate,Amount,Notes\n"
        );
    }
}

function readCSV() {
    ensureFile();

    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.trim().split("\n").slice(1);

    return lines.map((line) => {
        const [
            BoxNumber,
            CustomerName,
            MobileNumber,
            CollectionDate,
            Amount,
            Notes,
        ] = line.split(",");

        return {
            BoxNumber,
            CustomerName,
            MobileNumber,
            CollectionDate,
            Amount,
            Notes,
        };
    });
}

// ✅ GET → view entries
export async function GET() {
    const data = readCSV();
    return NextResponse.json(data);
}

// ✅ POST → add entry
export async function POST(req: Request) {
    ensureFile();

    const body = await req.json();

    const row = `${body.boxNumber},${body.customerName},${
        body.mobileNumber
    },${body.collectionDate},${body.amount},${
        body.notes?.replace(/,/g, " ") || ""
    }\n`;

    fs.appendFileSync(filePath, row);

    return NextResponse.json({ success: true });
}