import { z } from "zod";

export const createAccessorySchema = z.object({
    body: z.object({
        category: z.string().min(1, "Category is required"),
        item_name: z.string().min(1, "Item name is required"),
        item_number: z.string().min(1, "Item number is required"),
        price: z.number().min(1, "Price is required"),
        discount: z.number().min(0).optional(),
        offer_price: z.number().min(0).optional(),
        qty_on_hand: z.number().min(0).optional()
    })
})

export const updateAccessorySchema = z.object({
    body: z.object({
        category: z.string().min(1, "Category is required").optional(),
        item_name: z.string().min(1, "Item name is required").optional(),
        item_number: z.string().min(1, "Item number is required").optional(),
        price: z.number().min(1, "Price is required").optional(),
        discount: z.number().min(0).optional(),
        offer_price: z.number().min(0).optional(),
        qty_on_hand: z.number().min(0).optional()
    }),
    params: z.object({
        id: z.string(),
    }),
})

export const deleteAccessorySchema = z.object({
    params: z.object({
        id: z.string().min(1, "ID is required")
    })
})
export const getAccessoryByIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, "ID is required")
    })
})