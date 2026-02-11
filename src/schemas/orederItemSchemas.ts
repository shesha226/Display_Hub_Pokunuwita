import { z } from "zod";

export const createOrderItemSchema = z.object({
    order_id: z.number(),
    accessory_id: z.number(),
    quantity: z.number(),
    price: z.number(),
    discount: z.number(),
    final_price: z.number(),
});

export const updateOrderItemSchema = z.object({
    order_id: z.number(),
    accessory_id: z.number(),
    quantity: z.number(),
    price: z.number(),
    discount: z.number(),
    final_price: z.number(),
});

export const getOrderItemSchema = z.object({
    id: z.number(),
});

export const deleteOrderItemSchema = z.object({
    id: z.number(),
});
