"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Reports() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/entries")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);

        const sum = resData.reduce(
          (acc: number, item: any) => acc + Number(item.Amount || 0),
          0
        );
        setTotal(sum);
      });
  }, []);

  return (
    <div className="min-h-screen p-10">
      
      {/* Page Title + Button */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Collection History Report
          </h1>
          <p className="text-gray-500 mt-1">
            View and manage all fund collection transactions.
          </p>
        </div>

        <button
          onClick={() => router.push("/collection")}
          className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition cursor-pointer"
        >
          + Add New Collection
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-[#eef3f0] text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Box No</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Mobile</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Notes</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {data.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">
                <td className="px-6 py-4">{row.BoxNumber}</td>
                <td className="px-6 py-4 font-medium">
                  {row.CustomerName}
                </td>
                <td className="px-6 py-4">{row.MobileNumber}</td>
                <td className="px-6 py-4">
                  {new Date(row.CollectionDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-semibold text-green-600">
                  ₹{row.Amount}
                </td>
               <td className="px-6 py-4">
  {row.Notes && row.Notes.trim() !== "" ? row.Notes : "-"}
</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr></hr>

        {/* Total Section */}
        <div className="border-t bg-[#f0f6f2] px-6 py-4 flex justify-end">
          <div className="text-lg font-semibold text-gray-800">
            Total:{" "}
            <span className="text-green-600">
              ₹{total.toLocaleString()}
            </span>
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