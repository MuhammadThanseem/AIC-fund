"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StaticCalendar from "../componenets/CalendarWidget";

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

  const [recent, setRecent] = useState<any[]>([]);
  const isFormValid =
    form.customerName.trim() && form.collectionDate && Number(form.amount) > 0;

  useEffect(() => {
    loadRecentCollections();
  }, []);

  const loadRecentCollections = async () => {
    const res = await fetch("/api/entries?recent=true");
    const data = await res.json();
    setRecent(data);
  };

  const handleSubmit = async () => {
    // 🔴 Validation
    if (!form.customerName.trim()) {
      toast.error("Customer Name is required");
      return;
    }

    if (!form.collectionDate) {
      toast.error("Collection Date is required");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Collection Saved Successfully");
      loadRecentCollections();

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
      toast.error("Something went wrong");
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
                  CUSTOMER NAME <span className="text-red-500">*</span>
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
                  COLLECTION DATE <span className="text-red-500">*</span>
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
                  AMOUNT COLLECTED <span className="text-red-500">*</span>
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
              disabled={!isFormValid}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition
    ${
      isFormValid
        ? "bg-green-500 hover:bg-green-600 text-white"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
            >
              Confirm Collection
            </button>
          </div>

          {/* RIGHT SIDE PANEL */}
          <div className="space-y-6">
            {/* Calendar Placeholder */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <StaticCalendar />
            </div>

            {/* Recent Collections */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-gray-800">
              <h3 className="font-semibold mb-4">Recent Collections</h3>

              <div className="space-y-4 text-sm">
                {recent.length === 0 && (
                  <p className="text-gray-400">No collections yet</p>
                )}

                {recent.map((item) => (
                  <div key={item.Id} className="flex justify-between">
                    <div>
                      <p className="font-medium">
                        {item.BoxNumber} - {item.CustomerName}
                      </p>
                      <p className="text-gray-400">{item.CollectionDate}</p>
                    </div>

                    <div className="font-semibold text-green-600">
                      ₹ {Number(item.Amount).toLocaleString()}
                    </div>
                  </div>
                ))}
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
