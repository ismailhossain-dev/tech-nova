import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Award } from "lucide-react";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 items-center justify-center font-bold mb-2">
          <Award className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Official Authorized Brands
        </h1>
        <p className="text-xs text-zinc-500">
          Shop 100% genuine electronics from world-class tech manufacturers with official warranty
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((b) => (
          <Link
            key={b.id}
            href={`/shop?brand=${b.slug}`}
            className="group bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700">
                <Image
                  src={b.logo || "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&q=80"}
                  alt={b.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {b.name}
                </h3>
                <span className="text-xs text-zinc-500">
                  {b._count.products} Products Available
                </span>
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
