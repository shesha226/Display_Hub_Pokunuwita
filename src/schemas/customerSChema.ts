import { z } from "zod";

export const createCustomerSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    })
})

export const updateCustomerSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required").optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
    params: z.object({
        id: z.string().min(1, "ID is required"),
    }),
})

export const deleteCustomerSchema = z.object({
    params: z.object({
        id: z.string().min(1, "ID is required")
    })
})

export const getCustomerByIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, "ID is required")
    })
})