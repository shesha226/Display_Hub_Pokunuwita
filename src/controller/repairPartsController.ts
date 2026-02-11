import { Request, Response } from "express";
import { RepairRepository } from "../repositories/repairRepository";

// ================= CREATE REPAIR =================
export const createRepairPart = async (req: Request, res: Response) => {
  try {
    const { customer_name, phone_model, issue, repair_cost, status, advance } =
      req.body;

    if (!customer_name || !phone_model || !issue || repair_cost == null || advance == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRepair = await RepairRepository.create({
      customer_name,
      phone_model,
      issue,
      repair_cost,
      status,
      advance,
    });

    return res.status(201).json({
      message: "Repair part created successfully",
      invoice_number: newRepair.invoice_number,
    });
  } catch (err) {
    console.error("Error creating repair part:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// ================= GET ALL REPAIRS =================
export const getAllRepairParts = async (_req: Request, res: Response) => {
  try {
    const repairs = await RepairRepository.findAll();
    if (!repairs) {
      return res.status(404).json({ message: "Repair part not found" });
    }
    return res.status(200).json(repairs);
  } catch (err) {
    console.error("Error fetching repairs:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= GET REPAIR BY ID =================
export const getRepairPartById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const repair = await RepairRepository.findById(id);

    if (!repair) {
      return res.status(404).json({ message: "Repair part not found" });
    }

    return res.status(200).json(repair);
  } catch (err) {
    console.error("Error fetching repair:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= GET PENDING REPAIRS =================
export const getPendingRepairs = async (_req: Request, res: Response) => {
  try {
    const repairs = await RepairRepository.findPending();
    return res.status(200).json(repairs);
  } catch (err) {
    console.error("Error fetching pending repairs:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= UPDATE REPAIR =================
export const updateRepair = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { customer_name, phone_model, issue, repair_cost, status, advance } = req.body;

    // Check if repair exists
    const existingRepair = await RepairRepository.findById(id);
    if (!existingRepair) {
      return res.status(404).json({ message: "Repair not found" });
    }

    if (
      customer_name === undefined &&
      phone_model === undefined &&
      issue === undefined &&
      repair_cost === undefined &&
      status === undefined &&
      advance === undefined
    ) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update" });
    }

    // Update
    const updated = await RepairRepository.updateById(id, req.body);
    return res.status(200).json({
      message: "Repair updated successfully",
      repair: updated,
    });
  } catch (err) {
    console.error("Error updating repair:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= DELETE REPAIR =================
export const deleteRepairPartById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const deleted = await RepairRepository.deleteById(id);
    if (!deleted) {
      return res.status(404).json({ message: "Repair part not found" });
    }

    return res.status(200).json({ message: "Repair part deleted successfully" });
  } catch (err) {
    console.error("Error deleting repair:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
