"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, Plus, Trash2 } from "lucide-react";
import { confirmAlert } from "react-confirm-alert";

export default function Reports() {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/entries");
      const resData = await res.json();
      setData(resData);
    } catch (error) {
      console.error("Failed to fetch entries", error);
    }
  };

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

  const handleDelete = (id: string) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this collection entry?",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            await fetch(`/api/entries/${id}`, {
              method: "DELETE",
            });

            fetchEntries()
          },
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10 bg-[#0f172a]">
      {/* HEADER */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 lg:justify-between lg:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Collection History Report
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            View and manage all fund collection transactions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push("/collection")}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <Plus size={18} />
            Add New Collection
          </button>

          <button
            onClick={exportToPDF}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-gray-800">
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Box / Customer / Mobile / Notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-x-auto text-gray-800">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[#eef3f0] text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Box No</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Mobile</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Notes</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{row.BoxNumber}</td>
                <td className="px-6 py-4 font-medium">{row.CustomerName}</td>
                <td className="px-6 py-4">{row.MobileNumber}</td>
                <td className="px-6 py-4">
                  {new Date(row.CollectionDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-semibold text-green-600">
                  ₹{row.Amount}
                </td>
                <td className="px-6 py-4">{row.Notes?.trim() || "-"}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(row.Id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-400">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="border-t bg-[#f0f6f2] px-6 py-4 text-right">
          <span className="text-lg font-semibold">
            Total:{" "}
            <span className="text-green-600">₹{total.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4  text-gray-800">
        {filteredData.map((row, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border p-4 space-y-2"
          >
            <div className="flex justify-between">
              <span className="font-semibold">Box #{row.BoxNumber}</span>
              <span className="font-bold text-green-600">₹{row.Amount}</span>
            </div>

            <div className="text-sm text-gray-600">
              <div>{row.CustomerName}</div>
              <div>{row.MobileNumber}</div>
              <div>{new Date(row.CollectionDate).toLocaleDateString()}</div>
              {row.Notes && (
                <div className="italic text-gray-500">{row.Notes}</div>
              )}
              <div className="pt-2 border-t mt-2 flex justify-end">
                <button
                  onClick={() => handleDelete(row.Id)}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 cursor-pointer"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="text-center text-gray-400 py-6">No records found</div>
        )}

        <div className="bg-white rounded-xl border p-4 text-right font-semibold">
          Total:{" "}
          <span className="text-green-600">₹{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
