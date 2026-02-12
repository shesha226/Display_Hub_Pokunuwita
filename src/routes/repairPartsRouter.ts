import { Router } from "express";
import { validate } from "../middlewares/validate";
import { createRepairPartSchema, updateRepairPartSchema, deleteRepairPartSchema, getRepairPartSchema } from "../schemas/repairPartsSchema";
import { createRepair, deleteRepair, getAllRepairs, getRepair, updateRepair } from "../controller/repairPartsController";

const router = Router();

router.get("/", getAllRepairs);

router.post("/", validate(createRepairPartSchema), createRepair);

router.get("/:id", validate(getRepairPartSchema), getRepair);

router.put("/:id", validate(updateRepairPartSchema), updateRepair);

router.delete("/:id", validate(deleteRepairPartSchema), deleteRepair);

export default router;
