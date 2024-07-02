import { z } from "zod";

export const userSchema = z.object({
    full_name: z.string().min(3).max(255),
    email: z.string().email(),
    contact_phone: z.string().min(10).max(15),
    address: z.string().min(10).max(255),
    role: z.enum(["user", "admin"]),
    password: z.string().min(6).max(255),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});



export const vehicleSpecSchema = z.object({
    manufacturer: z.string().min(3).max(255),
    model: z.string().min(3).max(255),
    year: z.number().int(),
    fuel_type: z.string().min(3).max(255),
    engine_capacity: z.string().min(3).max(255),
    transmission: z.string().min(3).max(255),
    seating_capacity: z.number().int(),
    color: z.string().min(3).max(255),
    features: z.string().min(3).max(255),
});

export const vehicleSchema = z.object({
    vehicleSpec_id: z.number().int(),
    rental_rate: z.string().min(3).max(255),
    availability: z.boolean(),
});

export const locationSchema = z.object({
    name: z.string().min(3).max(255),
    address: z.string().min(10).max(255),
    contact_phone: z.string().min(10).max(15),
});
