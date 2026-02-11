import { Request, Response, NextFunction } from "express";
import { accessoryService } from "../services/accessoryService";

export const createAccessory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessory = await accessoryService.createAccessory(req.body);
    return res.status(201).json({
      message: "Accessory created successfully",
      accessory
    })
  } catch (err: any) {
    next(err);
  }
}

export const getAccessory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessory = await accessoryService.getAccessory(Number(req.params.id));
    return res.status(200).json({
      message: "Accessory fetched successfully",
      accessory
    })
  } catch (err: any) {
    next(err);
  }
}

export const getAllAccessories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessories = await accessoryService.getAllAccessories();
    return res.status(200).json({
      message: "Accessories fetched successfully",
      accessories
    })
  } catch (err: any) {
    next(err);
  }
}

export const updateAccessory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessory = await accessoryService.updateAccessory(Number(req.params.id), req.body);
    return res.status(200).json({
      message: "Accessory updated successfully",
      accessory
    })
  } catch (err: any) {
    next(err);
  }
}

export const deleteAccessory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessory = await accessoryService.deleteAccessory(Number(req.params.id));
    return res.status(200).json({
      message: "Accessory deleted successfully",
      accessory
    })
  } catch (err: any) {
    next(err);
  }
}