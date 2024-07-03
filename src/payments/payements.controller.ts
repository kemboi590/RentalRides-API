import { getEntitiesController, getEntityByIdController, deleteEntityController } from "../baseController/base.Generic.Controller";
import {
    getPaymentsService, getPaymentByIdService, paymentExistsService, createPaymentService, updatePaymentService, deletePaymentService
} from "./payements.service";

import { createEntityControllerWithDates, updateEntityControllerWithDates } from '../baseController/date.GenericController';


// get all payments
export const getPaymentsController = getEntitiesController(getPaymentsService);
// get payment by id
export const getPaymentByIdController = getEntityByIdController(getPaymentByIdService);
// create payment
export const createPaymentController = createEntityControllerWithDates(createPaymentService, ['payment_date']);
//  update payment
export const updatePaymentController = updateEntityControllerWithDates(paymentExistsService, updatePaymentService, ['payment_date']);
// delete payment
export const deletePaymentController = deleteEntityController(paymentExistsService, deletePaymentService);
