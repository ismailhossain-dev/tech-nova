import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, Package, Layers, Award, ShoppingCart, Users, Tag, AlertTriangle } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  const adminNav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products & Stock", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Layers },
    { href: "/admin/brands", label: "Brands", icon: Award },
    { href: "/admin/orders", label: "Orders & Fulfillment", icon: ShoppingCart },
    { href: "/admin/coupons", label: "Coupons", icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 space-y-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            ADM
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-zinc-900 dark:text-white">Admin Control</h2>
            <p className="text-[10px] text-zinc-500">{user.email}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
