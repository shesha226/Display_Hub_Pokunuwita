"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const markReopairDoneController_1 = require("../controller/markReopairDoneController");
const router = (0, express_1.Router)();
// DONE button එකේ route
router.put("/done/:id", markReopairDoneController_1.markRepairAsDone);
exports.default = router;
