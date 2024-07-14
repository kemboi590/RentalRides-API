import { Context } from "hono";
import { createPaymentService } from "./payements.service";
import { stripe } from "../drizzle/db";
import { ClientDomain } from './../utils';
export const createCheckoutSessionController = async (c: Context) => { // this function is called when the user clicks the pay button
  try {
    const payment = await c.req.json();
    const response = await createPaymentService(payment);

    const requestUrl = new URL(c.req.url); // get the request url, which is the url of the request
    const origin = requestUrl.origin; // get the origin of the request url which is the domain name
    // Create a checkout session and log the URL
    const session = await stripe.checkout.sessions.create({ // create a checkout session using the stripe object, the session will be created with the payment details
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { // product data is the product details
              name: 'Test Product',
            },
            unit_amount: Number(payment.amount) * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // use to client domain to redirect the user to the dashboard after payment
      success_url: `${ClientDomain}/dashboard/payment-successful`,
        cancel_url: `${ClientDomain}/dashboard/payment-failed`,
    });
    

    console.log(`Checkout Session URL: ${session.url}`);
    
    return c.json({ message: "Checkout session created", url: session.url }, 201);
  } catch (error: any) {
    console.error(`Error creating checkout session: ${error.message}`);
    return c.json({ error: error.message }, 400);
  }
};
