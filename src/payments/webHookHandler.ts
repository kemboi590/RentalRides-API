// import { stripe } from '../db';
import { Stripe } from 'stripe';
import { Context } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../drizzle/db';
import { paymentsTable } from '../drizzle/schema';

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;

export const handleWebhook = async (c: Context) => {
  const sig = c.req.header('stripe-signature');
  let event;

  try {
    const rawBody = await c.req.text();
    event = Stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return c.json({ error: `Webhook Error: ${err.message}` }, 400);
  }

  const data = event.data.object as Stripe.Checkout.Session;
  const eventType = event.type;

  if (eventType === 'checkout.session.completed') {
    const paymentIntentId = data.payment_intent as string;
    try {
      const payment = await db.query.paymentsTable.findFirst({
        where: eq(paymentsTable.transaction_id, paymentIntentId),
      });

      if (payment) {
        await db.update(paymentsTable)
          .set({ payment_status: 'Confirmed' })
          .where(eq(paymentsTable.payment_id, payment.payment_id));
      }
    } catch (dbError:any) {
      console.error(`Database Error: ${dbError.message}`);
      return c.json({ error: `Database Error: ${dbError.message}` }, 500);
    }
  }

  return c.json({ received: true });
};
