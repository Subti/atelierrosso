import Stripe from 'stripe';
import { Pool } from 'pg';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { fullName, email, phoneNumber, flavor, size, comments, pickupTime } =
    req.body;

  if (!fullName || !phoneNumber || !flavor || !size || !pickupTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const pickupDate = new Date(pickupTime);
  const currentDate = new Date();

  const minPickupDate = new Date();
  minPickupDate.setDate(currentDate.getDate() + 3);

  if (pickupDate < minPickupDate) {
    return res
      .status(400)
      .json({ error: 'Pickup time must be at least 3 days in advance.' });
  }

  if (pickupDate.getDay() === 1) {
    return res
      .status(400)
      .json({ error: 'Pickup time cannot be on a Monday.' });
  }

  let paymentAmount;
  if (size === 'Small') {
    paymentAmount = 3000;
  } else if (size === 'Medium') {
    paymentAmount = 5000;
  } else if (size === 'Large') {
    paymentAmount = 7000;
  } else {
    return res.status(400).json({ error: 'Invalid cake size' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `Cake - ${flavor} (${size})`,
              description: comments || 'No additional comments',
            },
            unit_amount: paymentAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        fullName,
        email,
        phoneNumber,
        flavor,
        size,
        comments,
        pickupTime,
      },
      success_url: 'https://atelierrosso.ca/success',
      cancel_url: 'https://atelierrosso.ca/cancel',
    });

    const paymentDate = new Date();

    await pool.query(
      `INSERT INTO orders (full_name, email, phone_number, cake_flavor, cake_size, payment_amount, payment_date, pickup_time, comments)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        fullName,
        email,
        phoneNumber,
        flavor,
        size,
        paymentAmount / 100,
        paymentDate,
        pickupDate,
        comments,
      ]
    );

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: 'An error occurred while creating the checkout session' });
  }
}
