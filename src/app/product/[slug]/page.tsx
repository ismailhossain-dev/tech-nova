import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      brand: true,
      variants: true,
      reviews: {
        where: { status: "APPROVED" },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Similar Products from same Category
  const similarProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: "PUBLISHED",
    },
    include: { category: true, brand: true, variants: true },
    take: 3,
  });

  return <ProductDetailClient product={product as any} similarProducts={similarProducts as any} />;
}
