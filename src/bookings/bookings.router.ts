import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';

import { bookingSchema} from '../validators';
import { getBookingsController, getBookingByIdController, deleteBookingController, createBookingHandler, updateBookingHandler } from './bookings.controller'

export const bookingRouter = new Hono()

// get all bookings
bookingRouter
    .get("bookings", getBookingsController)
    .post("bookings", zValidator('json', bookingSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), createBookingHandler)

// get booking by id
bookingRouter
    .get("bookings/:id", getBookingByIdController)
    .put("bookings/:id", zValidator('json', bookingSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), updateBookingHandler)
    .delete("bookings/:id", deleteBookingController)