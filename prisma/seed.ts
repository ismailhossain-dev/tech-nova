import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting TechNova Database Seeding...");

  // 1. Clean existing data
  await prisma.couponRedemption.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.stockAlert.deleteMany({});
  await prisma.priceAlert.deleteMany({});
  await prisma.recentlyViewed.deleteMany({});
  await prisma.orderStatusHistory.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.storeSettings.deleteMany({});

  // 2. Create Users
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "TechNova Admin",
      email: "admin@technova.com",
      password: adminPassword,
      role: "ADMIN",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "user@technova.com",
      password: userPassword,
      role: "CUSTOMER",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    },
  });

  console.log("✅ Seeded Users:", { admin: admin.email, customer: customer.email });

  // 3. Create Store Settings
  await prisma.storeSettings.create({
    data: {
      id: "default",
      shippingFee: 15.0,
      taxRate: 5.0,
      currency: "USD",
    },
  });

  // 4. Create Categories
  const categoriesData = [
    {
      name: "Laptops & Computers",
      slug: "laptops-computers",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Smartphones & Tablets",
      slug: "smartphones-tablets",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Audio & Headphones",
      slug: "audio-headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Wearables & Watches",
      slug: "wearables-watches",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Gaming & Consoles",
      slug: "gaming-consoles",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = created.id;
  }

  // 5. Create Brands
  const brandsData = [
    { name: "Apple", slug: "apple", logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&q=80" },
    { name: "Samsung", slug: "samsung", logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=200&q=80" },
    { name: "Sony", slug: "sony", logo: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80" },
    { name: "ASUS", slug: "asus", logo: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=200&q=80" },
    { name: "Dell", slug: "dell", logo: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=200&q=80" },
    { name: "Logitech", slug: "logitech", logo: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=200&q=80" },
  ];

  const brandMap: Record<string, string> = {};
  for (const b of brandsData) {
    const created = await prisma.brand.create({ data: b });
    brandMap[b.slug] = created.id;
  }

  // 6. Create Products with Variants
  const products = [
    {
      name: 'MacBook Pro 16" M3 Max',
      slug: "macbook-pro-16-m3-max",
      description: "Supercharged by Apple M3 Max chip with up to 16-core CPU and 40-core GPU. Liquid Retina XDR display.",
      categoryId: categoryMap["laptops-computers"],
      brandId: brandMap["apple"],
      basePrice: 3499,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
      ]),
      specifications: JSON.stringify({
        processor: "Apple M3 Max (16-Core)",
        ramOptions: "36GB / 48GB Unified",
        storageOptions: "1TB / 2TB SSD",
        display: '16.2" Liquid Retina XDR (3456x2234)',
        batteryLife: "Up to 22 hours",
        weight: "2.16 kg",
      }),
      warrantyMonths: 12,
      avgRating: 4.9,
      reviewCount: 28,
      status: "PUBLISHED" as const,
      variants: [
        {
          sku: "MBP16-M3-36-1TB-BLK",
          attributes: JSON.stringify({ ram: "36GB", storage: "1TB", color: "Space Black" }),
          price: 3499,
          stockQuantity: 15,
          lowStockThreshold: 3,
        },
        {
          sku: "MBP16-M3-48-2TB-SLV",
          attributes: JSON.stringify({ ram: "48GB", storage: "2TB", color: "Silver" }),
          price: 3999,
          stockQuantity: 8,
          lowStockThreshold: 2,
        },
      ],
    },
    {
      name: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      description: "Forged in titanium featuring the groundbreaking A17 Pro chip, customizable Action button, and 5x Telephoto camera.",
      categoryId: categoryMap["smartphones-tablets"],
      brandId: brandMap["apple"],
      basePrice: 1199,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
      ]),
      specifications: JSON.stringify({
        processor: "Apple A17 Pro",
        ramOptions: "8GB",
        storageOptions: "256GB / 512GB",
        display: '6.7" Super Retina XDR OLED (120Hz)',
        camera: "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto",
        weight: "221 g",
      }),
      warrantyMonths: 12,
      avgRating: 4.8,
      reviewCount: 45,
      status: "PUBLISHED" as const,
      variants: [
        {
          sku: "IP15PM-256-NAT",
          attributes: JSON.stringify({ storage: "256GB", color: "Natural Titanium" }),
          price: 1199,
          stockQuantity: 25,
          lowStockThreshold: 5,
        },
        {
          sku: "IP15PM-512-BLU",
          attributes: JSON.stringify({ storage: "512GB", color: "Blue Titanium" }),
          price: 1399,
          stockQuantity: 12,
          lowStockThreshold: 3,
        },
      ],
    },
    {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      description: "Welcome to the era of mobile AI. Galaxy AI features, Titanium frame, 200MP camera, and built-in S Pen.",
      categoryId: categoryMap["smartphones-tablets"],
      brandId: brandMap["samsung"],
      basePrice: 1299,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
      ]),
      specifications: JSON.stringify({
        processor: "Snapdragon 8 Gen 3 for Galaxy",
        ramOptions: "12GB",
        storageOptions: "256GB / 512GB",
        display: '6.8" Dynamic AMOLED 2X (120Hz)',
        camera: "200MP Main + 50MP 5x Telephoto + 10MP 3x + 12MP UW",
        weight: "232 g",
      }),
      warrantyMonths: 12,
      avgRating: 4.7,
      reviewCount: 32,
      status: "PUBLISHED" as const,
      variants: [
        {
          sku: "S24U-256-GRY",
          attributes: JSON.stringify({ storage: "256GB", color: "Titanium Gray" }),
          price: 1299,
          stockQuantity: 20,
          lowStockThreshold: 4,
        },
        {
          sku: "S24U-512-BLK",
          attributes: JSON.stringify({ storage: "512GB", color: "Titanium Black" }),
          price: 1419,
          stockQuantity: 10,
          lowStockThreshold: 2,
        },
      ],
    },
    {
      name: "Sony WH-1000XM5 Wireless Headphones",
      slug: "sony-wh-1000xm5",
      description: "Industry-leading noise canceling with 8 microphones and Auto NC Optimizer. Up to 30-hour battery life with quick charging.",
      categoryId: categoryMap["audio-headphones"],
      brandId: brandMap["sony"],
      basePrice: 399,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      ]),
      specifications: JSON.stringify({
        driverSize: "30mm",
        batteryLife: "30 Hours (NC On)",
        connectivity: "Bluetooth 5.2, Multipoint",
        noiseCanceling: "Industry-leading Dual Processor V1",
        weight: "250 g",
      }),
      warrantyMonths: 12,
      avgRating: 4.9,
      reviewCount: 64,
      status: "PUBLISHED" as const,
      variants: [
        {
          sku: "WH1000XM5-BLK",
          attributes: JSON.stringify({ color: "Black" }),
          price: 399,
          stockQuantity: 40,
          lowStockThreshold: 5,
        },
        {
          sku: "WH1000XM5-SLV",
          attributes: JSON.stringify({ color: "Silver" }),
          price: 399,
          stockQuantity: 18,
          lowStockThreshold: 3,
        },
      ],
    },
    {
      name: "ASUS ROG Zephyrus G16 (2024)",
      slug: "asus-rog-zephyrus-g16",
      description: "Ultra-slim OLED gaming laptop powered by Intel Core Ultra 9 and NVIDIA GeForce RTX 4070/4080 graphics.",
      categoryId: categoryMap["laptops-computers"],
      brandId: brandMap["asus"],
      basePrice: 1999,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
      ]),
      specifications: JSON.stringify({
        processor: "Intel Core Ultra 9 185H",
        gpu: "NVIDIA GeForce RTX 4070 / RTX 4080",
        ramOptions: "16GB / 32GB LPDDR5X",
        storageOptions: "1TB / 2TB PCIe 4.0 SSD",
        display: '16" ROG Nebula OLED 2.5K 240Hz',
        weight: "1.85 kg",
      }),
      warrantyMonths: 24,
      avgRating: 4.8,
      reviewCount: 19,
      status: "PUBLISHED" as const,
      variants: [
        {
          sku: "ROG-G16-16-1TB-4070",
          attributes: JSON.stringify({ ram: "16GB", storage: "1TB", gpu: "RTX 4070", color: "Eclipse Gray" }),
          price: 1999,
          stockQuantity: 14,
          lowStockThreshold: 3,
        },
        {
          sku: "ROG-G16-32-2TB-4080",
          attributes: JSON.stringify({ ram: "32GB", storage: "2TB", gpu: "RTX 4080", color: "Platinum White" }),
          price: 2699,
          stockQuantity: 6,
          lowStockThreshold: 2,
        },
      ],
    },
    {
      name: "Logitech MX Master 3S Wireless Mouse",
      slug: "logitech-mx-master-3s",
      description: "Iconic ergonomic performance mouse with 8K DPI track-on-glass sensor and Quiet Clicks.",
      categoryId: categoryMap["laptops-computers"],
      brandId: brandMap["logitech"],
      basePrice: 99,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
      ]),
      specifications: JSON.stringify({
        sensor: "Darkfield 8000 DPI",
        buttons: "7 Customizable Buttons",
        batteryLife: "Up to 70 days on full charge",
        weight: "141 g",
      }),
      warrantyMonths: 12,
      avgRating: 4.9,
      reviewCount: 110,
      status: "PUBLISHED" as const,
      variants: [
        {
          sku: "MXM3S-GRAPHITE",
          attributes: JSON.stringify({ color: "Graphite" }),
          price: 99,
          stockQuantity: 50,
          lowStockThreshold: 10,
        },
        {
          sku: "MXM3S-PALEGRAY",
          attributes: JSON.stringify({ color: "Pale Gray" }),
          price: 99,
          stockQuantity: 30,
          lowStockThreshold: 5,
        },
      ],
    },
  ];

  for (const prodData of products) {
    const { variants, ...productInfo } = prodData;
    const createdProduct = await prisma.product.create({
      data: productInfo,
    });

    for (const varData of variants) {
      await prisma.productVariant.create({
        data: {
          ...varData,
          productId: createdProduct.id,
        },
      });
    }
  }

  console.log("✅ Seeded Products and Variants");

  // 7. Create Coupons
  await prisma.coupon.create({
    data: {
      code: "TECHNOVA10",
      type: "PERCENTAGE",
      value: 10, // 10% off
      minOrderValue: 50,
      usageLimit: 500,
      usageCount: 12,
      perUserLimit: 2,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      stackable: false,
    },
  });

  await prisma.coupon.create({
    data: {
      code: "FLAT50",
      type: "FIXED",
      value: 50, // $50 off
      minOrderValue: 300,
      usageLimit: 100,
      usageCount: 5,
      perUserLimit: 1,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      stackable: false,
    },
  });

  console.log("✅ Seeded Coupons");
  console.log("🎉 Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
