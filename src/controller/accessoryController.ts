import { Request, Response, NextFunction } from "express";
import { accessoryService } from "../services/accessoryService";
import dbPromise from "../config/db";


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
    const id = Number(req.params.id);
    const accessory = await accessoryService.updateAccessory(id, req.body);

    return res.status(200).json({
      message: "Accessory updated successfully",
      accessory
    });
  } catch (err: any) {
    console.error("Update accessory error:", err);
    return res.status(err.status || 500).json({
      message: err.message || "Internal Server Error"
    });
  }
};
export const deleteAccessory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await accessoryService.deleteAccessory(id);

    return res.status(200).json({
      message: "Accessory deleted successfully",
      accessory: result,
    });
  } catch (err: any) {
    console.error("Delete accessory error:", err);
    return res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
};