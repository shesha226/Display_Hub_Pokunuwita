import { z } from "zod";


export const createRepairPartSchema = z.object({
    body: z.object({
        customer_name: z.string().min(3, "Customer name must be at least 3 characters"),
        phone_model: z.string().min(1, "Phone model is required"),
        issue: z.string().min(1, "Issue is required"),
        repair_cost: z.number().min(0, "Repair cost must be at least 0"),
        status: z.string().optional(),
        advance: z.number().min(0, "Advance must be at least 0"),
    }),
});
export const updateRepairPartSchema = z.object({
    body: z.object({
        cusomer_name: z.string().min(3, "Customer name must be at least 3 characters").optional(),
        phone_model: z.string().min(1, "Phone model is required").optional(),
        issue: z.string().min(1, "Issue is required").optional(),
        repair_cost: z.number().min(0, "Repair cost must be at least 0").optional(),
        status: z.string().optional(),
        advance: z.number().min(0, "Advance must be at least 0").optional(),
    }),
    params: z.object({
        id: z.string().min(1, "ID is required"),
    }),
});


export const deleteRepairPartSchema = z.object({
    params: z.object({
        id: z.string().min(1, "ID is required"),
    }),
});

export const getRepairPartSchema = z.object({
    params: z.object({
        id: z.string().min(1, "ID is required"),
    }),
});
