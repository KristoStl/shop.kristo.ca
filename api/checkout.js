// /api/checkout.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items } = req.body; // items array from front-end cart

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items in cart" });
    }

    // Map front-end items to Stripe line items
    const line_items = items.map(item => {
      // Build description from custom fields
      let desc = item.fullDesc || "";
      if (item.customData) {
        desc += "\n" + Object.entries(item.customData)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: desc,
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
        },
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${req.headers.origin}?success=true`,
      cancel_url: `${req.headers.origin}?canceled=true`,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
