import { Context } from "hono";
import { getEntitiesController, getEntityByIdController, deleteEntityController, createEntityController } from "../baseController/base.Generic.Controller";
import {
    getPaymentsService, getPaymentByIdService, paymentExistsService, createPaymentService, updatePaymentService, deletePaymentService
} from "./payements.service";

import { createEntityControllerWithDates, updateEntityControllerWithDates } from '../baseController/date.GenericController';


// get all payments
export const getPaymentsController = getEntitiesController(getPaymentsService);
// get payment by id
export const getPaymentByIdController = getEntityByIdController(getPaymentByIdService);
// create payment
// export const createPaymentController = createEntityController(createPaymentService);
//  update payment
export const updatePaymentController = updateEntityControllerWithDates(paymentExistsService, updatePaymentService, ['payment_date']);
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