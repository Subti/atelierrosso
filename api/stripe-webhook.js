import { buffer } from 'micro';
import Stripe from 'stripe';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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
  let event;

  try {
    const buf = await buffer(req);

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const insertResult = await pool.query(
        `INSERT INTO orders (full_name, email, phone_number, cake_type, cake_flavor, cake_size, payment_amount, payment_date, pickup_time, comments)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id`,
        [
          session.metadata.fullName,
          session.metadata.email,
          session.metadata.phoneNumber,
          session.metadata.cakeType,
          session.metadata.flavor,
          session.metadata.size,
          session.amount_total / 100,
          new Date(),
          new Date(session.metadata.pickupTime),
          session.metadata.comments,
        ]
      );
      const orderId = insertResult.rows[0].id;

      console.log('Order inserted into database:', orderId);

      const orderDetails = `
    <h2>Order Summary</h2>
    <ul style="list-style: none; padding: 0;">
      <li><strong>Order Number:</strong> ${orderId}</li> <!-- Use the generated orderId -->
      <li><strong>Name:</strong> ${session.metadata.fullName}</li>
      <li><strong>Phone:</strong> ${session.metadata.phoneNumber}</li>
      <li><strong>Email:</strong> ${session.metadata.email}</li>
      <li><strong>Cake Type:</strong> ${session.metadata.cakeType}</li>
      <li><strong>Flavor:</strong> ${session.metadata.flavor}</li>
      <li><strong>Size:</strong> ${session.metadata.size}</li>
      <li><strong>Pickup Time:</strong> ${new Date(
        session.metadata.pickupTime
      ).toLocaleString()}</li>
      <li><strong>Comments:</strong> ${session.metadata.comments || 'None'}</li>
      <li><strong>Amount Paid:</strong> $${(session.amount_total / 100).toFixed(
        2
      )}</li>
    </ul>
  `;
    } catch (err) {
      console.error('Failed to insert order into database:', err);
    }

    try {
      await resend.emails.send({
        from: `"Atelier Rosso" <orders@atelierrosso.ca>`,
        to: 'atelierrosso1@gmail.com',
        subject: 'New Cake Order',
        html: `<h2>New Order Received</h2>${orderDetails}`,
      });
      console.log('Email sent successfully!');
    } catch (err) {
      console.error('Failed to send email:', err);
    }

    try {
      await resend.emails.send({
        from: 'Atelier Rosso <orders@atelierrosso.ca>',
        to: session.customer_email,
        subject: 'Order Confirmation - Atelier Rosso',
        html: `<h2>Thank You for Your Order!</h2><p>Here are your order details:</p>${orderDetails} <br> <br> <p>This is an automated email, please do not reply. For any questions or concerns please contact atelierrosso1@gmail.com</p>`,
        reply_to: 'atelierrosso1@gmail.com',
      });
      console.log('Confirmation email sent successfully!');
    } catch (err) {
      console.error('Failed to send confirmation email:', err);
    }
  }

  res.status(200).json({ received: true });
}
