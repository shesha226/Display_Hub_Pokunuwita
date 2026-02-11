import { Router } from "express";
import { repairController } from "../controller/repairPartsController";

const router = Router();


router.get("/", repairController.getAllRepairs);


router.post("/", repairController.createRepair);


router.get("/:id", repairController.getRepair);


router.put("/:id", repairController.updateRepair);


router.delete("/:id", repairController.deleteRepair);

export default router;
