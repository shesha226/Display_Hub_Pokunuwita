import { Router } from "express";
import { getAllReports } from "../controller/reportController";

const router = Router();

router.get("/all", getAllReports);

export default router;
