import { Router } from "express";
import { markRepairAsDone } from "../controller/markReopairDoneController";

const router = Router();

// DONE button එකේ route
router.put("/done/:id", markRepairAsDone);

export default router;
