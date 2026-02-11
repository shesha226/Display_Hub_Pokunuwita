import { Request, Response, NextFunction } from "express";
import { customerService } from "../services/customerService";


export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

export const getAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const customer = await customerService.getCutomerbyId(id);
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const customer = await customerService.updateCustomer(id, req.body);
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const customer = await customerService.deleteCustomer(id);
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};


