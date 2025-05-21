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

  const {
    fullName,
    email,
    phoneNumber,
    cakeType,
    flavor,
    size,
    comments,
    pickupTime,
  } = req.body;

  if (
    !fullName ||
    !phoneNumber ||
    !cakeType ||
    !flavor ||
    !size ||
    !pickupTime
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const REGULAR_CAKE_PRICES = {
    Small: 3000,
    Medium: 5000,
    Large: 7000,
  };
  const GELATO_CAKE_PRICES = {
    Small: 3500,
    Medium: 5500,
    Large: 7500,
  };
  const PISTACHIO_SURCHARGE = 500;

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

  let basePrice;
  if (cakeType === 'Regular Cake') {
    basePrice = REGULAR_CAKE_PRICES[size];
  } else if (cakeType === 'Gelato Cake') {
    basePrice = GELATO_CAKE_PRICES[size];
  } else {
    return res.status(400).json({ error: 'Invalid cake type' });
  }

  if (!basePrice) {
    return res.status(400).json({ error: 'Invalid cake size' });
  }

  let paymentAmount = basePrice;
  if (flavor === 'Pistachio') {
    paymentAmount += PISTACHIO_SURCHARGE;
  }

  try {
    const paymentDate = new Date();

    const insertResult = await pool.query(
      `INSERT INTO orders (full_name, email, phone_number, cake_type, cake_flavor, cake_size, payment_amount, payment_date, pickup_time, comments)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id`,
      [
        fullName,
        email,
        phoneNumber,
        cakeType,
        flavor,
        size,
        paymentAmount / 100,
        paymentDate,
        pickupDate,
        comments,
      ]
    );
    const orderId = insertResult.rows[0].id;

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
        orderId: orderId.toString(),
        fullName,
        email,
        phoneNumber,
        cakeType,
        flavor,
        size,
        comments,
        pickupTime,
      },
      success_url:
        'https://atelierrosso.ca/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://atelierrosso.ca/cancel',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: 'An error occurred while creating the checkout session' });
  }
}
