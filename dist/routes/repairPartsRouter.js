"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const repairPartsController_1 = require("../controller/repairPartsController");
const router = (0, express_1.Router)();
// Get all repairs
router.get("/", repairPartsController_1.getAllRepairParts);
// Create a repair
router.post("/", repairPartsController_1.createRepairPart);
// Get repair by ID
router.get("/:id", repairPartsController_1.getRepairPartById);
// Update repair
router.put("/:id", repairPartsController_1.updateRepair);
// Delete repair
router.delete("/:id", repairPartsController_1.deleteRepairPartById);
exports.default = router;
