import { Context } from "hono";
import { createPaymentService } from "./payements.service";
import { stripe } from "../drizzle/db";
export const createCheckoutSessionController = async (c: Context) => {
  try {
    const payment = await c.req.json();
    const response = await createPaymentService(payment);

    const requestUrl = new URL(c.req.url);
    const origin = requestUrl.origin;
    // Create a checkout session and log the URL
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Product',
            },
            unit_amount: Number(payment.amount) * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
        success_url: `${origin}/success.html`,
        cancel_url: `${origin}/cancel.html`,


    //   success_url: `${c.req.origin}/success.html`,
    //   cancel_url: `${c.req.origin}/cancel.html`,
    });
    

    console.log(`Checkout Session URL: ${session.url}`);
    
    return c.json({ message: "Checkout session created", url: session.url }, 201);
  } catch (error: any) {
    console.error(`Error creating checkout session: ${error.message}`);
    return c.json({ error: error.message }, 400);
  }
};
