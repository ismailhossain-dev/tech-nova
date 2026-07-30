import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Package, Truck, ArrowRight, CheckCircle2, Clock } from "lucide-react";

export default async function OrdersListPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-500" /> Order History & Live Tracking
        </h1>
        <p className="text-xs text-zinc-500">Track and manage all your TechNova purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <Package className="w-12 h-12 text-zinc-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">No orders placed yet</h3>
          <p className="text-xs text-zinc-500">Explore our catalog and place your first order.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-zinc-900 dark:text-white">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full">
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s) • Payment: {order.paymentMethod}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                  {formatPrice(order.total)}
                </span>

                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
                >
                  Track Order <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
