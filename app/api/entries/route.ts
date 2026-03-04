export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const dataDir = path.join(process.cwd(), "app/data");
const filePath = path.join(dataDir, "entries.csv");

function ensureFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
      filePath,
      "Id,BoxNumber,CustomerName,MobileNumber,CollectionDate,Amount,Notes\n"
    );
  }
}

function readCSV() {
  ensureFile();

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.trim().split("\n").slice(1);

  return lines.map((line) => {
    const [
      Id,
      BoxNumber,
      CustomerName,
      MobileNumber,
      CollectionDate,
      Amount,
      Notes,
    ] = line.split(",");

    return {
      Id,
      BoxNumber,
      CustomerName,
      MobileNumber,
      CollectionDate,
      Amount,
      Notes,
    };
  });
}

function writeCSV(data: any[]) {
  const header =
    "Id,BoxNumber,CustomerName,MobileNumber,CollectionDate,Amount,Notes\n";

  const rows = data
    .map(
      (row) =>
        `${row.Id},${row.BoxNumber},${row.CustomerName},${row.MobileNumber},${row.CollectionDate},${row.Amount},${row.Notes}`
    )
    .join("\n");

  fs.writeFileSync(filePath, header + rows + "\n");
}

//
// ===============================
// ✅ GET ALL OR RECENT 5
// ===============================
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const recent = searchParams.get("recent");

  const data = readCSV();

  if (recent === "true") {
    return NextResponse.json(data.slice(-3).reverse());
  }

  return NextResponse.json(data.reverse());
}

//
// ===============================
// ✅ ADD ENTRY
// ===============================
export async function POST(req: Request) {
  ensureFile();
  const body = await req.json();

  const newEntry = {
    Id: crypto.randomUUID(),
    BoxNumber: body.boxNumber,
    CustomerName: body.customerName,
    MobileNumber: body.mobileNumber,
    CollectionDate: body.collectionDate,
    Amount: body.amount,
    Notes: body.notes?.replace(/,/g, " ") || "",
  };

  const data = readCSV();
  data.push(newEntry);

  writeCSV(data);

  return NextResponse.json({ success: true });
}

//
// ===============================
// ✅ EDIT ENTRY
// ===============================
export async function PUT(req: Request) {
  const body = await req.json();
  const data = readCSV();

  const index = data.findIndex((item) => item.Id === body.id);

  if (index === -1) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  data[index] = {
    ...data[index],
    BoxNumber: body.boxNumber,
    CustomerName: body.customerName,
    MobileNumber: body.mobileNumber,
    CollectionDate: body.collectionDate,
    Amount: body.amount,
    Notes: body.notes?.replace(/,/g, " ") || "",
  };

  writeCSV(data);

  return NextResponse.json({ success: true });
}