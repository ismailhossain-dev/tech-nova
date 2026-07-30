import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Layers } from "lucide-react";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="md:max-w-7xl  lg:max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 items-center justify-center font-bold mb-2">
          <Layers className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Browse Product Categories
        </h1>
        <p className="text-xs text-zinc-500">
          Discover our curated collection of electronics engineered for power, speed, and elegance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative bg-zinc-900 rounded-3xl border border-zinc-200 border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <Image
                src={cat.image || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600/80 px-2 py-0.5 rounded-full">
                  {cat._count.products} Products
                </span>
                <h3 className="text-xl font-bold mt-1 group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>View Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
