import { NextResponse } from "next/server";
import databaseConnection from "@/lib/dbConfig";
import Booking from "@/models/bookingModel";

export async function POST(req) {
  try {
    await databaseConnection();

    const { bookingId } = await req.json();
    if (!bookingId)
      return NextResponse.json({ error: "bookingId required" }, { status: 400 });

    const booking = await Booking.findById(bookingId).populate("consultantId");
    if (!booking)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey)
      return NextResponse.json(
        { error: "Stripe secret key missing" },
        { status: 500 }
      );

    const allowLive =
      String(process.env.ALLOW_LIVE_PAYMENTS || "false").toLowerCase() ===
      "true";
    const isLiveKey = stripeSecretKey.startsWith("sk_live_");
    if (isLiveKey && !allowLive) {
      return NextResponse.json(
        { error: "Live payments are disabled. Use test keys." },
        { status: 403 }
      );
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

    const origin = req.nextUrl.origin;

    // ✅ Convert booking amount (in rupees) to paise (INR smallest unit)
    const amountInPaise = Math.round(Number(booking.slot?.bookingAmount || 0) * 100);
    if (!amountInPaise || amountInPaise <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // ✅ Use INR instead of USD
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"], // others like UPI/Wallet auto-enabled for INR
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Consultation with ${
                booking.consultantId?.firstName || "Consultant"
              }`,
            },
            unit_amount: amountInPaise,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: String(booking._id),
        env: isLiveKey ? "live" : "test",
      },
      success_url: `${origin}/chat/${booking._id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/chat/${booking._id}`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (e) {
    console.error("Stripe session error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
