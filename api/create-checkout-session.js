const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { amount } = req.body;

    // Biztonság: eurócentben adja át a Stripe-nak
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Donate a Meal",
              description: "Provide food for children in need",
            },
            unit_amount: amount * 100, // 1 € = 100 cent
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://donate-meals.vercel.app/success",
      cancel_url: "https://donate-meals.vercel.app/cancel",
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
};
