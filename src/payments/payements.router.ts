import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';

import { paymentSchema } from '../validators';

import { getPaymentsController, getPaymentByIdController, deletePaymentController, createPaymentController, updatePaymentController } from './payements.controller'
import { createCheckoutSessionController } from './checkoutSession';
export const paymentRouter = new Hono()

// get all payments
paymentRouter
    .get("payments", getPaymentsController)
    .post("payments", zValidator('json', paymentSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), createPaymentController)

// get payment by id
paymentRouter
    .get("payments/:id", getPaymentByIdController)
    .put("payments/:id", zValidator('json', paymentSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), updatePaymentController)
    .delete("payments/:id", deletePaymentController)


    // checkout session
paymentRouter.post("checkout-session", createCheckoutSessionController)
    