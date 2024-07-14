// import { stripe } from '../db';
import { Stripe } from 'stripe';
import { Context } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../drizzle/db';
import { paymentsTable } from '../drizzle/schema';

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;

export const handleWebhook = async (c: Context) => { // this function is called when the webhook is triggered in the stripe dashboard
  const sig = c.req.header('stripe-signature'); // get the stripe signature from the request header, the signature is used to verify the webhook if it is from stripe
  let event;

  try {
    const rawBody = await c.req.text(); // get the raw body of the request, raw means the body is not parsed
    event = Stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret); // construct the event from the raw body and the stripe signature. It becomes an event object
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return c.json({ error: `Webhook Error: ${err.message}` }, 400);
  }

  const data = event.data.object as Stripe.Checkout.Session; // get the data object from the event, the data object is the session object which contains the payment intent id
  const eventType = event.type; // get the event type from the event object, this type is the event that triggered the webhook, it can be checkout.session.completed or payment_intent.succeeded

  if (eventType === 'checkout.session.completed') {
    const paymentIntentId = data.payment_intent as string; // get the payment intent id from the session object
    try {
      const payment = await db.query.paymentsTable.findFirst({
        where: eq(paymentsTable.transaction_id, paymentIntentId), // find the payment in the database using the payment intent id,t his will return the payment object
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
