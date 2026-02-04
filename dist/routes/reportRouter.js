"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controller/reportController");
const router = (0, express_1.Router)();
router.get("/all", reportController_1.getAllReports);
exports.default = router;
