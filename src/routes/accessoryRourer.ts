import { Router } from "express";
import {
  createAccessory,
  getAllAccessories,
  getAccessory,
  updateAccessory,
  deleteAccessory,
} from "../controller/accessoryController";

import { validate } from "../middlewares/validate";
import { createAccessorySchema, updateAccessorySchema, deleteAccessorySchema, getAccessoryByIdSchema } from "../schemas/accessorySchema";

const router = Router();

router.get("/", getAllAccessories);
router.get("/:id", validate(getAccessoryByIdSchema), getAccessory);
router.post("/", createAccessory);
router.put("/:id", validate(updateAccessorySchema), updateAccessory);
router.delete("/:id", validate(deleteAccessorySchema), deleteAccessory);

export default router;
