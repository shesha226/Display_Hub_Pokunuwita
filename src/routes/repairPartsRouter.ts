import { Router } from "express";
import {
  createRepairPart,
  getAllRepairParts,
  getRepairPartById,
  updateRepair,
  deleteRepairPartById,
} from "../controller/repairPartsController";

const router = Router();

// Get all repairs
router.get("/", getAllRepairParts);

// Create a repair
router.post("/", createRepairPart);

// Get repair by ID
router.get("/:id", getRepairPartById);

// Update repair
router.put("/:id", updateRepair);

// Delete repair
router.delete("/:id", deleteRepairPartById);

export default router;
