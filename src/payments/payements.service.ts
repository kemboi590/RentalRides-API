import { eq } from "drizzle-orm";
import {db} from "../drizzle/db";

import { TIPayments,TSPayments, paymentsTable } from "../drizzle/schema";

// GET ALL PAYMENTS
export const getPaymentsService = async (): Promise<TSPayments[]> => {
    const payments = await db.query.paymentsTable.findMany();
    return payments;
}

// GET PAYMENT BY ID
export const getPaymentByIdService = async (id: number): Promise<TSPayments | undefined> => {
    const payment = await db.query.paymentsTable.findFirst({
        where: eq(paymentsTable.payment_id, id)
    });
    return payment || undefined;
}

// CHECK IF PAYMENT EXISTS
export const paymentExistsService = async (id: number): Promise<boolean> => {
    const payment = await getPaymentByIdService(id);
    return payment !== undefined; //returns true if payment exists
}

// CREATE PAYMENT
export const createPaymentService = async (payment: TIPayments): Promise<string> => {
    await db.insert(paymentsTable).values(payment)
    return "payment created successfully";
}

//  UPDATE PAYMENT
export const updatePaymentService = async (id: number, payment: TIPayments): Promise<string> => {
    await db.update(paymentsTable).set(payment).where(eq(paymentsTable.payment_id, id));
    return "payment updated successfully";
}

// DELETE PAYMENT
export const deletePaymentService = async (id: number): Promise<string> => {
    await db.delete(paymentsTable).where(eq(paymentsTable.payment_id, id));
    return "payment deleted successfully";
}