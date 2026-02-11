import { z } from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        customer_id: z.number(),
        items: z.array(
            z.object({
                accessory_id: z.number(),
                quantity: z.number(),
                price: z.number(),
                discount: z.number(),
                final_price: z.number(),
            })
        ),
    }),
});

export const updateOrderSchema = z.object({
    body: z.object({
        customer_id: z.number(),
        items: z.array(
            z.object({
                accessory_id: z.number(),
                quantity: z.number(),
                price: z.number(),
                discount: z.number(),
                final_price: z.number(),
            })
        ),
    }),
});

export const deleteOrderSchema = z.object({
    params: z.object({
        id: z.number().min(1, "ID is required"),
    }),
});

export const getOrderByIdSchema = z.object({
    params: z.object({
        id: z.number().min(1, "ID is required"),
    }),
});

