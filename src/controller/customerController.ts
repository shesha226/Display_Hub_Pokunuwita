import { Request, Response, NextFunction } from "express";
import { customerService } from "../services/customerService";
import dbPromise from "../config/db";


export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json({ message: "Customer created successfully", customer });
  } catch (error) {
    next(error);
  }
};

export const getAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.status(200).json({ message: "Customers fetched successfully", customers });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const customer = await customerService.getCutomerbyId(id);
    res.status(200).json({ message: "Customer fetched successfully", customer });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid customer ID" });

    const customer = await customerService.updateCustomer(id, req.body);

    res.status(200).json({
      message: "Customer updated successfully",
      customer,
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || "Internal Server Error" });
  }
};


export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const customer = await customerService.deleteCustomer(id);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    next(error);
  }
};


