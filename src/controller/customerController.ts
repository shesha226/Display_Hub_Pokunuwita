import { Request, Response } from "express";
import * as service from "../services/customerService";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const id = await service.createCustomer(req.body);
    res.status(201).json({ message: "Customer created successfully", id });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await service.getCustomers();
    res.json({ customers });
  } catch (err: any) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    await service.updateCustomer(id, req.body);
    res.json({ message: "Customer updated successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    await service.deleteCustomer(id);
    res.json({ message: "Customer deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
