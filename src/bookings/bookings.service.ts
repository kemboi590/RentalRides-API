import { eq } from "drizzle-orm";
import db from "../drizzle/db";

import { TIBookings, TSBookings, bookingsTable } from "../drizzle/schema";

// GET ALL BOOKINGS
export const getBookingsService = async (): Promise<TSBookings[]> => {
    const bookings = await db.query.bookingsTable.findMany();
    return bookings;
}

// GET BOOKING BY ID
export const getBookingByIdService = async (id: number): Promise<TSBookings | undefined> => {
    const booking = await db.query.bookingsTable.findFirst({
        where: eq(bookingsTable.booking_id, id)
    });
    return booking || undefined;
}

// CHECK IF BOOKING EXISTS
export const bookingExistsService = async (id: number): Promise<boolean> => {
    const booking = await getBookingByIdService(id);
    return booking !== undefined; //returns true if booking exists
}

// CREATE BOOKING
export const createBookingService = async (booking: TIBookings): Promise<string> => {
    await db.insert(bookingsTable).values(booking)
    return "booking created successfully";
}

//  UPDATE BOOKING
export const updateBookingService = async (id: number, booking: TIBookings): Promise<string> => {
    await db.update(bookingsTable).set(booking).where(eq(bookingsTable.booking_id, id));
    return "booking updated successfully";
}

// DELETE BOOKING
export const deleteBookingService = async (id: number): Promise<string> => {
    await db.delete(bookingsTable).where(eq(bookingsTable.booking_id, id));
    return "booking deleted successfully";
}

