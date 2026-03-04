"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, Plus } from "lucide-react";

export default function Reports() {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetch("/api/entries")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
      });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch =
        row.BoxNumber?.toLowerCase().includes(search.toLowerCase()) ||
        row.CustomerName?.toLowerCase().includes(search.toLowerCase()) ||
        row.MobileNumber?.includes(search) ||
        row.Notes?.toLowerCase().includes(search.toLowerCase());

      const rowDate = new Date(row.CollectionDate);

      const matchesFrom = !fromDate || rowDate >= new Date(fromDate);

      const matchesTo = !toDate || rowDate <= new Date(toDate);

      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [data, search, fromDate, toDate]);

  const total = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => acc + Number(item.Amount || 0),
      0,
    );
  }, [filteredData]);

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Collection History Report", 14, 15);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    const tableColumn = [
      "Box No",
      "Customer",
      "Mobile",
      "Date",
      "Amount",
      "Notes",
    ];

    const tableRows = filteredData.map((row) => [
      row.BoxNumber,
      row.CustomerName,
      row.MobileNumber || "-",
      new Date(row.CollectionDate).toLocaleDateString(),
      `₹${row.Amount}`,
      row.Notes?.trim() || "-",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [34, 197, 94], // green
        textColor: 255,
      },
      columnStyles: {
        4: { halign: "right" }, // Amount right aligned
      },
      didDrawPage: () => {
        doc.setFontSize(12);
        doc.text(
          `Total: ₹${total.toLocaleString()}`,
          14,
          doc.internal.pageSize.height - 10,
        );
      },
    });

    doc.save("collection-report.pdf");
  };

  return (
    <div className="min-h-screen p-10">
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Collection History Report
          </h1>
          <p className="text-gray-500 mt-1">
            View and manage all fund collection transactions.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/collection")}
            className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer"
          >
            <Plus size={18} />
            <span>Add New Collection</span>
          </button>

          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
          >
            <Download size={18} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* 🔍 FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-wrap gap-4 items-end text-gray-800">
        <div className="flex-1 min-w-[220px]">
          <label className="text-sm text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Box / Customer / Mobile / Notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-lg text-gray-800"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="block mt-1 px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="block mt-1 px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[#eef3f0] text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Box No</th>
              <th className="px-6 py-4">Customer</th>

              {/* Hide on very small screens */}
              <th className="px-6 py-4 hidden sm:table-cell">Mobile</th>
              <th className="px-6 py-4 hidden md:table-cell">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 hidden lg:table-cell">Notes</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {filteredData.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{row.BoxNumber}</td>
                <td className="px-6 py-4 font-medium">{row.CustomerName}</td>

                <td className="px-6 py-4 hidden sm:table-cell">
                  {row.MobileNumber}
                </td>

                <td className="px-6 py-4 hidden md:table-cell">
                  {new Date(row.CollectionDate).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 font-semibold text-green-600">
                  ₹{row.Amount}
                </td>

                <td className="px-6 py-4 hidden lg:table-cell">
                  {row.Notes?.trim() || "-"}
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* TOTAL */}
        <div className="border-t bg-[#f0f6f2] px-6 py-4 flex justify-end text-gray-800">
          <div className="text-lg font-semibold">
            Total:{" "}
            <span className="text-green-600">₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Pagination
      <div className="flex justify-end mt-6 gap-2">
        <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 text-gray-800">
          Previous
        </button>
        <button className="px-4 py-2 border rounded-lg bg-green-500 text-white">
          1
        </button>
        <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 text-gray-800">
          2
        </button>
        <button className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 text-gray-800">
          Next
        </button>
      </div> */}
    </div>
  );
}
