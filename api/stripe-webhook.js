import { buffer } from 'micro';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

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
    console.log('Customer email from session:', session.customer_email);

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
        to: 'johnpaulsaliba@gmail.com',
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
