import { Context } from "hono";
import { invalidParam, notFound, tryCatchWrapper } from "../factory/factory";
import { TIBookings } from "../drizzle/schema";
import { ExistService } from "./generic.Controller";


export interface CreateBookingService {
    (booking: TIBookings, c: Context): Promise<string>;
}

export interface UpdateBookingService {
    (id: number, booking: TIBookings, c: Context): Promise<string>;

}

// create booking controller with date CreateBookingService
export const createBookingController = (service: CreateBookingService) =>
    tryCatchWrapper(async (c: Context): Promise<Response> => {
        const booking = await c.req.json();

        // convert date strings to date objects
        if (booking.booking_date) {
            booking.booking_date = new Date(booking.booking_date);
        }
        if (booking.return_date) {
            booking.return_date = new Date(booking.return_date);
        }
        const res = await service(booking, c);
        if (!res) return c.json({ message: 'Booking not created' }, 400);
        return c.json({ message: res }, 201);
    });

// update booking controller with date CreateBookingService
export const updateBookingController = (existsService: ExistService, service: UpdateBookingService) =>
    tryCatchWrapper(async (c: Context): Promise<Response> => {
        const id = parseInt(c.req.param('id'));
        if (isNaN(id)) return invalidParam(c);

        const exists = await existsService(id,c);
        if (!exists) return notFound(c);

        const booking = await c.req.json();
        // convert date strings to date objects
        if (booking.booking_date) {
            booking.booking_date = new Date(booking.booking_date);
        }
        if (booking.return_date) {
            booking.return_date = new Date(booking.return_date);
        }
        const res = await service(id, booking, c);
        if (!res) return c.json({ message: 'Booking not updated' }, 400);
        return c.json({ message: res }, 200);
    });