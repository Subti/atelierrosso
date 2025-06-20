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
  let event;

  try {
    const buf = await buffer(req);
    console.log('Raw request body buffer:', buf.toString());
    console.log('Stripe signature header:', sig);

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('Stripe event constructed successfully:', event.type);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Checkout session completed:', session);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const orderDetails = `
    <h2>Order Summary</h2>
    <ul style="list-style: none; padding: 0;">
      <li><strong>Order Number:</strong> ${session.metadata.orderId}</li>
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

    try {
      await transporter.sendMail({
        from: `"Atelier Rosso" <${process.env.GMAIL_USER}>`,
        to: 'atelierrosso1@gmail.com',
        subject: 'New Cake Order',
        html: `<h2>New Order Received</h2>${orderDetails}`,
      });
      console.log('Email sent successfully!');
    } catch (err) {
      console.error('Failed to send email:', err);
    }
  }

  if (session.customer_email) {
    try {
      await transporter.sendMail({
        from: `"Atelier Rosso" <${process.env.GMAIL_USER}>`,
        to: session.customer_email,
        subject: 'Order Confirmation',
        html: `<h2>Thank You for Your Order!</h2><p>Here are your order details:</p>${orderDetails}`,
      });
      console.log('Email sent to customer successfully!');
    } catch (err) {
      console.error('Failed to send email to customer:', err);
    }
  }

  res.status(200).json({ received: true });
}
