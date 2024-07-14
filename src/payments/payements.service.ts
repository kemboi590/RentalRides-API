import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { TIPayments, TSPayments, paymentsTable } from "../drizzle/schema";
import { stripe } from "../drizzle/db";

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
  return payment !== undefined;
}

export const createPaymentService = async (payment: TIPayments) => {
  if (payment.booking_id === undefined) {
    throw new Error("Booking ID is required");
  }

  // Create a payment intent
  const paymentIntent = await stripe.paymentIntents.create({ //payment intent means the payment is created to be paid
    amount: Number(payment.amount) * 100,
    currency: "usd",
    metadata: { booking_id: payment.booking_id }, // meta data is used to store additional information
  });

  // Save the payment intent id to the database
  await db.insert(paymentsTable).values({ // insert the payment details to the database, the customer will pay the amount
    booking_id: payment.booking_id,
    amount: payment.amount,
    payment_status: "Pending",
    payment_date: new Date(),
    payment_method: "Card",
    transaction_id: paymentIntent.id,
  }).execute();

  //checkout session URL
  return { message: "Payment created successfully", client_secret: paymentIntent.client_secret };
};

// UPDATE PAYMENT STATUS
export const updatePaymentStatus = async (transactionId: string, status: string) => {
  await db.update(paymentsTable)
    .set({ payment_status: status })
    .where(eq(paymentsTable.transaction_id, transactionId));
};

// DELETE PAYMENT
export const deletePaymentService = async (id: number): Promise<string> => {
  await db.delete(paymentsTable).where(eq(paymentsTable.payment_id, id));
  return "payment deleted successfully";
}