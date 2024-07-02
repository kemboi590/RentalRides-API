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

