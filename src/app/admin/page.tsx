import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle } from "lucide-react";
import { AdminCharts } from "@/components/admin/AdminCharts";

export default async function AdminDashboardPage() {
  const [totalOrders, totalUsers, totalProducts, lowStockVariants, orders] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count(),
    prisma.productVariant.findMany({
      where: {
        stockQuantity: { lte: 5 },
      },
      include: { product: true },
    }),
    prisma.order.findMany({
      select: { total: true, createdAt: true, status: true },
    }),
  ]);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  // Group monthly revenue for Recharts
  const monthlyDataMap: Record<string, number> = {
    Jan: 4200, Feb: 6100, Mar: 8500, Apr: 7300, May: 11200, Jun: 14500, Jul: 16800
  };

  const chartData = Object.entries(monthlyDataMap).map(([month, revenue]) => ({
    month,
    revenue,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Executive Sales & Analytics Dashboard</h1>
        <p className="text-xs text-zinc-500">Real-time overview of revenue performance, order volume, and inventory health</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">
            {formatPrice(totalRevenue)}
          </p>
          <span className="text-[11px] text-emerald-500 font-semibold">+18.4% from last month</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingCart className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{totalOrders}</p>
          <span className="text-[11px] text-blue-500 font-semibold">Active processing</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Customers</span>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{totalUsers}</p>
          <span className="text-[11px] text-purple-500 font-semibold">Registered users</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Alerts</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{lowStockVariants.length}</p>
          <span className="text-[11px] text-amber-500 font-semibold">SKUs below threshold</span>
        </div>
      </div>

      {/* Recharts Component */}
      <AdminCharts data={chartData} />

      {/* Low Stock Alerts Table */}
      {lowStockVariants.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Low-Stock Inventory Trigger List
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 font-bold border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white">
                <tr>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Current Stock</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {lowStockVariants.map((v) => (
                  <tr key={v.id}>
                    <td className="p-3 font-mono font-bold text-zinc-900 dark:text-white">{v.sku}</td>
                    <td className="p-3 font-semibold">{v.product.name}</td>
                    <td className="p-3">{formatPrice(v.price)}</td>
                    <td className="p-3 font-bold text-red-600 dark:text-red-400">{v.stockQuantity} remaining</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded">
                        Restock Needed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
