"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, MapPin, Package, Shield, Plus, Check, Trash2, Home } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: "",
    isDefault: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
    } else if (session?.user) {
      fetchAddresses();
    }
  }, [status, session]);

  const fetchAddresses = async () => {
    const res = await fetch("/api/addresses");
    if (res.ok) {
      const data = await res.json();
      setAddresses(data);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAddress),
    });

    if (res.ok) {
      setShowAddressModal(false);
      setNewAddress({
        label: "Home",
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        postalCode: "",
        isDefault: false,
      });
      fetchAddresses();
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="md:max-w-7xl  lg:max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/20">
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {session?.user?.name}
            </h1>
            <p className="text-xs text-zinc-500">{session?.user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full">
                Role: {session?.user?.role}
              </span>
              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="px-2.5 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded-full flex items-center gap-1 hover:bg-indigo-700 transition"
                >
                  <Shield className="w-3 h-3" /> Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>

        <Link
          href="/orders"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition"
        >
          <Package className="w-4 h-4" /> View My Orders & Tracking
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Stats & Account Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" /> Account Security
            </h3>
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span>Account ID</span>
                <span className="font-mono text-zinc-900 dark:text-white text-[11px]">
                  {session?.user?.id}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span>Email Status</span>
                <span className="text-emerald-500 font-semibold">✓ Verified</span>
              </div>
              <div className="flex justify-between py-2">
                <span>2FA Authentication</span>
                <span className="text-zinc-400">Disabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Addresses Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" /> Saved Shipping Addresses
              </h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <Plus className="w-4 h-4" /> Add Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                <MapPin className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                <p className="text-xs text-zinc-500 font-medium">No saved shipping addresses yet.</p>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="mt-3 text-xs text-blue-600 font-bold hover:underline"
                >
                  Add your first address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-xl border relative space-y-2 text-xs transition ${addr.isDefault
                        ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/20"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900 dark:text-white uppercase text-[10px] tracking-wider bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Default
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-zinc-900 dark:text-white">{addr.fullName}</p>
                    <p className="text-zinc-600 dark:text-zinc-400">{addr.phone}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {addr.addressLine}, {addr.city} {addr.postalCode}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Add New Shipping Address
            </h3>
            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Address Label
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  placeholder="Home / Work / Office"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Full Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  placeholder="+880 1700-000000"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                  Address Line
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.addressLine}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                  placeholder="House #12, Road #4, Gulshan-2"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="Dhaka"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    placeholder="1212"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isDefault" className="text-zinc-700 dark:text-zinc-300">
                  Set as default shipping address
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
