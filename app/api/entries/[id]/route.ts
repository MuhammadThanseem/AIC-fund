import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const filePath = path.join(process.cwd(), "app/data/entries.csv");

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ AWAIT params
    const { id } = await context.params;

    console.log("Deleting ID:", id);

    const csvData = fs.readFileSync(filePath, "utf-8");

    const records: any[] = parse(csvData, {
      columns: (header) => header.map((h: string) => h.trim()),
      skip_empty_lines: true,
      trim: true,
    });

    const index = records.findIndex(
      (row) => String(row.id) === String(id)
    );

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "ID not found" },
        { status: 404 }
      );
    }

    // ✅ delete ONLY matching row
    records.splice(index, 1);

    const updatedCSV = stringify(records, { header: true });

    fs.writeFileSync(filePath, updatedCSV);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 }
    );
  }
}