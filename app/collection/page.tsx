"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    boxNumber: "",
    customerName: "",
    mobileNumber: "",
    collectionDate: today,
    amount: "",
    notes: "",
  });

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Collection Saved Successfully ✅");

      const today = new Date().toISOString().split("T")[0];

      setForm({
        boxNumber: "",
        customerName: "",
        mobileNumber: "",
        collectionDate: today,
        amount: "",
        notes: "",
      });
    } catch (error) {
      toast.error("Something went wrong ❌");
    }
  };
  return (
    <div>
      {/* Page Content */}
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <h2 className="text-3xl font-bold mb-2">New Collection Entry</h2>
        <p className="text-gray-500 mb-8">
          Record a new manual fund collection for a specific box holder.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT SIDE FORM */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-8 space-y-6">
            {/* Box Number */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                BOX NUMBER
              </label>
              <input
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none placeholder:text-gray-400  text-gray-800"
                placeholder="Search or enter box number (e.g. BX-102)"
                value={form.boxNumber}
                onChange={(e) =>
                  setForm({ ...form, boxNumber: e.target.value })
                }
              />
            </div>

            {/* Name + Mobile */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-800">
                  CUSTOMER NAME
                </label>
                <input
                  className="w-full border rounded-lg px-4 py-3 placeholder:text-gray-400  text-gray-800"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm({ ...form, customerName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-800">
                  MOBILE NUMBER
                </label>
                <input
                  className="w-full border rounded-lg px-4 py-3 placeholder:text-gray-400  text-gray-800"
                  value={form.mobileNumber}
                  onChange={(e) =>
                    setForm({ ...form, mobileNumber: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Date + Amount */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-800">
                  COLLECTION DATE
                </label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-4 py-3 placeholder:text-gray-400  text-gray-800"
                  value={form.collectionDate}
                  onChange={(e) =>
                    setForm({ ...form, collectionDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-800">
                  AMOUNT COLLECTED
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full border rounded-lg px-4 py-3 placeholder:text-gray-400  text-gray-800"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                NOTES (OPTIONAL)
              </label>
              <textarea
                className="w-full border rounded-lg px-4 py-3 placeholder:text-gray-400  text-gray-800"
                placeholder="Add any specific details about this collection..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-semibold text-lg transition"
            >
              Confirm Collection
            </button>
          </div>

          {/* RIGHT SIDE PANEL */}
          <div className="space-y-6">
            {/* Calendar Placeholder */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4 text-gray-800">October 2023</h3>
              <div className="text-gray-400 text-sm">
                (Calendar UI can be added using a date picker library)
              </div>
            </div>

            {/* Recent Collections */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-gray-800">
              <h3 className="font-semibold mb-4">Recent Collections</h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">BX-045 - John Wick</p>
                    <p className="text-gray-400">2 hours ago</p>
                  </div>
                  <div className="font-semibold">$120.00</div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">BX-112 - Jane Smith</p>
                    <p className="text-gray-400">5 hours ago</p>
                  </div>
                  <div className="font-semibold">$450.00</div>
                </div>
              </div>

              <Link
                href="/"
                className="text-green-600 mt-4 text-sm font-medium inline-block hover:underline"
              >
                View All Collections
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
