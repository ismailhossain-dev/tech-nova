import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        address: true,
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
        statusHistory: {
          orderBy: { changedAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { addressId, items, paymentMethod, discount = 0 } = body;

    if (!addressId || !items || items.length === 0 || !paymentMethod) {
      return NextResponse.json({ error: "Missing required order details" }, { status: 400 });
    }

    // Calculate Subtotal from Database Variant Prices
    let subtotal = 0;
    const orderItemData = [];

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
      });

      if (!variant || variant.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for SKU ${variant?.sku || item.variantId}` },
          { status: 400 }
        );
      }

      subtotal += variant.price * item.quantity;
      orderItemData.push({
        variantId: variant.id,
        quantity: item.quantity,
        priceAtPurchase: variant.price,
      });

      // Deduct Stock Quantity
      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { stockQuantity: variant.stockQuantity - item.quantity },
      });
    }

    const shipping = 15.0;
    const tax = subtotal * 0.05;
    const total = Math.max(0, subtotal + shipping + tax - discount);

    // Enforce initial payment status and status flow
    const initialStatus = paymentMethod === "COD" ? "CONFIRMED" : "PENDING";
    const initialPaymentStatus = "PENDING";

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        addressId,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        paymentMethod,
        paymentStatus: initialPaymentStatus,
        status: initialStatus,
        items: {
          create: orderItemData,
        },
        statusHistory: {
          create: [
            {
              status: "PENDING",
              note: "Order created successfully",
            },
            ...(initialStatus === "CONFIRMED"
              ? [
                  {
                    status: "CONFIRMED" as const,
                    note: "Order confirmed via Cash on Delivery",
                  },
                ]
              : []),
          ],
        },
      },
      include: {
        items: true,
        statusHistory: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
