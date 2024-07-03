import { getBookingsService, getBookingByIdService, bookingExistsService, createBookingService, updateBookingService, deleteBookingService } from "./bookings.service";
import { getEntitiesController, getEntityByIdController, createEntityController, updateEntityController, deleteEntityController } from "../generics/generic.Controller";
import { createBookingController, updateBookingController } from "../generics/booking.baseController";

// get all bookings
export const getBookingsController = getEntitiesController(getBookingsService);
// get booking by id
export const getBookingByIdController = getEntityByIdController(getBookingByIdService);
// create booking
export const createBookingHandler = createBookingController(createBookingService);
//  update booking
export const updateBookingHandler = updateBookingController(bookingExistsService, updateBookingService);
// delete booking
export const deleteBookingController = deleteEntityController(bookingExistsService, deleteBookingService);