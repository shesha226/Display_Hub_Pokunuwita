import { z } from "zod";


export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    }),
});


export const loginUserSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password required"),
    }),
});


export const userIdParamSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive(),
    }),
});

export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().min(3).optional(),
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
    }),
    params: z.object({
        id: z.coerce.number().int().positive(),
    }),
});
