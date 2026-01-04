import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { items } = req.body;

  const line_items = items.map(i => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: i.name,
        description: Object.entries(i).filter(([k,_]) => !["name","price","cartId","id","type","image"].includes(k)).map(([k,v]) => `${k}: ${JSON.stringify(v)}`).join(", "),
      },
      unit_amount: i.price * 100,
    },
    quantity: 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
