import { Request, Response } from "express";
import * as service from "../services/accessoryService";

export const createAccessory = async (req: Request, res: Response) => {
  try {
    const accessory = await service.createAccessory(req.body);
    return res
      .status(201)
      .json({ message: "Accessory created successfully", accessory });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const getAccessoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const accessory = await service.getAccessory(id);
    if (!accessory)
      return res.status(404).json({ message: "Accessory not found" });

    return res.json(accessory);
  } catch (err: any) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllAccessories = async (_req: Request, res: Response) => {
  try {
    const accessories = await service.getAllAccessories();
    return res.json({ accessories });
  } catch (err: any) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAccessory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const updated = await service.updateAccessory(id, req.body);
    return res.json({
      message: "Accessory updated successfully",
      accessory: updated,
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const deleteAccessory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    await service.deleteAccessory(id);
    return res.json({ message: "Accessory deleted successfully" });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
