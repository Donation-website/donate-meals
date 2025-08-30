const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


module.exports = async (req, res) => {
if (req.method !== 'POST') {
res.setHeader('Allow', 'POST');
return res.status(405).end('Method Not Allowed');
}


try {
const { amount } = req.body;
const allowed = [1, 2, 5];
if (!allowed.includes(amount)) return res.status(400).json({ error: 'Invalid amount' });


const session = await stripe.checkout.sessions.create({
payment_method_types: ['card'],
line_items: [{
price_data: {
currency: 'eur',
product_data: { name: `${amount}€ Donation` },
unit_amount: amount * 100,
},
quantity: 1,
}],
mode: 'payment',
success_url: 'https://meal-campaign.vercel.app/success',
cancel_url: 'https://meal-campaign.vercel.app/cancel',
locale: 'hu'
});


res.status(200).json({ id: session.id });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error', message: err.message });
}
};
