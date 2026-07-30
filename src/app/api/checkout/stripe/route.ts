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

    // Mock Stripe Checkout Session URL for demonstration / sandbox test
    const stripeCheckoutUrl = `/orders/${orderId}?paymentSuccess=true&gateway=Stripe`;

    return NextResponse.json({ url: stripeCheckoutUrl });
  } catch (error) {
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}
