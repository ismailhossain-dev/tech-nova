import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


//bdg proudct
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId");
    const categorySlug = searchParams.get("category");
    const brandId = searchParams.get("brandId");
    const brandSlug = searchParams.get("brand");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const rating = searchParams.get("rating") ? parseFloat(searchParams.get("rating")!) : undefined;
    const inStock = searchParams.get("inStock") === "true";
    const sortBy = searchParams.get("sortBy") || "newest";
    const ram = searchParams.get("ram");
    const storage = searchParams.get("storage");
    const color = searchParams.get("color");

    const where: any = {
      status: "PUBLISHED",
    };

    if (categoryId) {
      where.categoryId = categoryId;
    } else if (categorySlug) {
      const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (cat) where.categoryId = cat.id;
    }

    if (brandId) {
      where.brandId = brandId;
    } else if (brandSlug) {
      const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
      if (brand) where.brandId = brand.id;
    }

    if (rating) {
      where.avgRating = { gte: rating };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Handle price range & spec filter via ProductVariant
    const variantWhere: any = {};
    if (minPrice !== undefined || maxPrice !== undefined) {
      variantWhere.price = {};
      if (minPrice !== undefined) variantWhere.price.gte = minPrice;
      if (maxPrice !== undefined) variantWhere.price.lte = maxPrice;
    }

    if (inStock) {
      variantWhere.stockQuantity = { gt: 0 };
    }

    if (ram || storage || color) {
      const specConditions: string[] = [];
      if (ram) specConditions.push(ram);
      if (storage) specConditions.push(storage);
      if (color) specConditions.push(color);

      variantWhere.AND = specConditions.map((val) => ({
        attributes: { contains: val },
      }));
    }

    if (Object.keys(variantWhere).length > 0) {
      where.variants = {
        some: variantWhere,
      };
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "price_low_high") {
      orderBy = { basePrice: "asc" };
    } else if (sortBy === "price_high_low") {
      orderBy = { basePrice: "desc" };
    } else if (sortBy === "rating") {
      orderBy = { avgRating: "desc" };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        brand: true,
        variants: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Fetch Products API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
