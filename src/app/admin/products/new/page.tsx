import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();
  const brands = await prisma.brand.findMany();

  async function createProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const slug = (formData.get("slug") as string) || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const brandId = formData.get("brandId") as string;
    const basePrice = parseFloat(formData.get("basePrice") as string);
    const sku = formData.get("sku") as string;
    const ram = formData.get("ram") as string;
    const storage = formData.get("storage") as string;
    const color = formData.get("color") as string;
    const stockQuantity = parseInt(formData.get("stockQuantity") as string, 10);
    const imageUrl = formData.get("imageUrl") as string || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80";

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        brandId,
        basePrice,
        images: JSON.stringify([imageUrl]),
        specifications: JSON.stringify({ ram, storage, color }),
        status: "PUBLISHED",
      },
    });

    await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku,
        attributes: JSON.stringify({ ram, storage, color }),
        price: basePrice,
        stockQuantity,
        lowStockThreshold: 5,
      },
    });

    redirect("/admin/products");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Create New Product</h1>
        <p className="text-xs text-zinc-500">Add a new electronics product with variant & inventory specification</p>
      </div>

      <form action={createProduct} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 text-xs">
        <div>
          <label className="block font-bold mb-1">Product Name</label>
          <input type="text" name="name" required placeholder="e.g. iPad Pro 13-inch M4" className="w-full p-2.5 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
        </div>

        <div>
          <label className="block font-bold mb-1">Description</label>
          <textarea name="description" required rows={3} placeholder="Full product summary..." className="w-full p-2.5 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">Category</label>
            <select name="categoryId" required className="w-full p-2.5 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold mb-1">Brand</label>
            <select name="brandId" required className="w-full p-2.5 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700">
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">Base Price ($)</label>
            <input type="number" step="0.01" name="basePrice" required placeholder="1299.00" className="w-full p-2.5 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
          </div>

          <div>
            <label className="block font-bold mb-1">SKU Code</label>
            <input type="text" name="sku" required placeholder="IPAD-13-M4-256" className="w-full p-2.5 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-bold mb-1">RAM</label>
            <input type="text" name="ram" placeholder="16GB" className="w-full p-2.5 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
          </div>
          <div>
            <label className="block font-bold mb-1">Storage</label>
            <input type="text" name="storage" placeholder="512GB" className="w-full p-2.5 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
          </div>
          <div>
            <label className="block font-bold mb-1">Color</label>
            <input type="text" name="color" placeholder="Space Black" className="w-full p-2.5 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">Initial Stock Quantity</label>
            <input type="number" name="stockQuantity" required defaultValue={10} className="w-full p-2.5 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
          </div>

          <div>
            <label className="block font-bold mb-1">Image URL</label>
            <input type="url" name="imageUrl" placeholder="https://images.unsplash.com/..." className="w-full p-2.5 border rounded-xl dark:bg-zinc-800 dark:border-zinc-700" />
          </div>
        </div>

        <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition">
          Publish Product
        </button>
      </form>
    </div>
  );
}
