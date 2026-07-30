import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Package, Truck, CheckCircle2, Clock, MapPin, CreditCard, ArrowLeft, Download, FileText } from "lucide-react";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      address: true,
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
      statusHistory: {
        orderBy: { changedAt: "asc" },
      },
    },
  });

  if (!order || (order.userId !== user.id && user.role !== "ADMIN")) {
    notFound();
  }

  const statusSteps = [
    { status: "PENDING", label: "Order Placed", icon: Clock },
    { status: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
    { status: "SHIPPED", label: "Dispatched", icon: Package },
    { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Truck },
    { status: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
  ];

  const currentStatusIndex = statusSteps.findIndex((s) => s.status === order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <Link href="/orders" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-2 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
          </Link>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-xs text-zinc-500">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/api/orders/${order.id}/invoice`}
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            <Download className="w-4 h-4" /> Download PDF Invoice
          </Link>
        </div>
      </div>

      {/* Order Status Tracking Timeline */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
        <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-500" /> Live Tracking Timeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {statusSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;

            return (
              <div
                key={step.status}
                className={`p-4 rounded-2xl border text-center space-y-2 relative transition ${
                  isCurrent
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20"
                    : isCompleted
                    ? "border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20"
                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 opacity-60"
                }`}
              >
                <div
                  className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center font-bold ${
                    isCompleted
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{step.label}</h4>
                <span className="text-[10px] text-zinc-400 block uppercase font-mono">
                  {isCompleted ? "✓ Passed" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items & Financial Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">Order Items</h3>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {order.items.map((item) => {
                const images = JSON.parse(item.variant.product.images || "[]");
                return (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                        <Image src={images[0]} alt={item.variant.product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white">{item.variant.product.name}</h4>
                        <span className="text-[10px] text-zinc-400">SKU: {item.variant.sku} (x{item.quantity})</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">
                      {formatPrice(item.priceAtPurchase * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">Payment & Delivery</h3>
            <div className="py-2 border-b border-zinc-100 dark:border-zinc-800 flex justify-between">
              <span className="text-zinc-500">Method</span>
              <span className="font-bold text-zinc-900 dark:text-white">{order.paymentMethod}</span>
            </div>
            <div className="py-2 border-b border-zinc-100 dark:border-zinc-800 flex justify-between">
              <span className="text-zinc-500">Payment Status</span>
              <span className="font-bold text-emerald-500">{order.paymentStatus}</span>
            </div>
            <div className="pt-2 space-y-1">
              <span className="text-zinc-500 font-semibold block">Shipping Address:</span>
              <p className="font-bold text-zinc-900 dark:text-white">{order.address.fullName}</p>
              <p className="text-zinc-500">{order.address.phone}</p>
              <p className="text-zinc-500">{order.address.addressLine}, {order.address.city}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
