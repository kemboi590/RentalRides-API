import { Context } from "hono";
import { getEntitiesController, getEntityByIdController, deleteEntityController, createEntityController } from "../baseController/base.Generic.Controller";
import {
    getPaymentsService, getPaymentByIdService, paymentExistsService, createPaymentService, updatePaymentStatus, deletePaymentService
} from "./payements.service";

import { createEntityControllerWithDates, updateEntityControllerWithDates } from '../baseController/date.GenericController';

// import Stripe from "stripe";
import { Stripe } from 'stripe';
const endpointSecret  = process.env.STRIPE_ENDPOINT_SECRET as string;

// get all payments
export const getPaymentsController = getEntitiesController(getPaymentsService);
// get payment by id
export const getPaymentByIdController = getEntityByIdController(getPaymentByIdService);
// delete payment
export const deletePaymentController = deleteEntityController(paymentExistsService, deletePaymentService);

export const createPaymentController = async(c: Context) => {
    try {
        const payment = await c.req.json();
        const response = await createPaymentService(payment);
        return c.json(response, 201)
    } catch (error:any) {
        return c.json({ error: error.message }, 400)
    }
}


// HANDLE STRIPE WEBHOOK
export const handleWebhooks = async (c: Context) => {
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
            await updatePaymentStatus(paymentIntentId, 'Confirmed');
        } catch (dbError: any) {
            console.error(`Database Error: ${dbError.message}`);
            return c.json({ error: `Database Error: ${dbError.message}` }, 500);
        }
    }

    return c.json({ received: true });
};