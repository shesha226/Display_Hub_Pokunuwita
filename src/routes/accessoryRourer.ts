import { Router } from "express";
import {
  createAccessory,
  getAllAccessories,
  getAccessoryById,
  updateAccessory,
  deleteAccessory,
} from "../controller/accessoryController";

const router = Router();

router.get("/", getAllAccessories);
router.get("/:id", getAccessoryById);
router.post("/", createAccessory);
router.put("/:id", updateAccessory);
router.delete("/:id", deleteAccessory);

export default router;
