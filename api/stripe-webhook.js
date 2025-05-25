import { buffer } from 'micro';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const orderDetails = Object.entries(session.metadata || {})
      .map(([key, value]) => `<b>${key}:</b> ${value}`)
      .join('<br>');

    await transporter.sendMail({
      from: `"Atelier Rosso" <${process.env.GMAIL_USER}>`,
      to: 'atelierrosso1@gmail.com',
      subject: 'New Cake Order',
      html: `<h2>New Order Received</h2>${orderDetails}`,
    });
  }

  res.status(200).json({ received: true });
}
