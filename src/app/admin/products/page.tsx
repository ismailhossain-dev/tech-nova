import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Plus, AlertCircle, Edit, Trash2, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      brand: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
            Product & Inventory Management
          </h1>
          <p className="text-xs text-zinc-500">
            Manage product variants, prices, inventory thresholds, and catalog status
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-200 font-bold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Total Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {products.map((prod) => {
                const totalStock = prod.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
                const isLowStock = prod.variants.some((v) => v.stockQuantity <= v.lowStockThreshold);

                return (
                  <tr key={prod.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 font-bold text-zinc-900 dark:text-white">
                      {prod.name}
                      <div className="text-[10px] text-zinc-400 font-normal">
                        {prod.variants.length} variant(s)
                      </div>
                    </td>
                    <td className="p-4">{prod.category.name}</td>
                    <td className="p-4">{prod.brand.name}</td>
                    <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">
                      {formatPrice(prod.basePrice)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          totalStock === 0
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : isLowStock
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {totalStock} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          prod.status === "PUBLISHED"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        {prod.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/product/${prod.slug}`}
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        View Product
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
