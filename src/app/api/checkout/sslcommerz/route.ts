import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId } = body;

    // Mock SSLCommerz Hosted Payment Gateway URL (bKash/Nagad/Rocket redirect)
    const sslcommerzUrl = `/orders/${orderId}?paymentSuccess=true&gateway=SSLCommerz`;

    return NextResponse.json({ url: sslcommerzUrl });
  } catch (error) {
    return NextResponse.json({ error: "SSLCommerz error" }, { status: 500 });
  }
}
