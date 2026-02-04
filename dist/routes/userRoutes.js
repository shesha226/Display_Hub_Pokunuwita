"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const authMiddleware_1 = require("../authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.post("/register", userController_1.createUser);
router.post("/login", userController_1.loginUser);
// Protected routes
router.get("/", authMiddleware_1.authenticate, userController_1.getAllUsers);
router.get("/:id", authMiddleware_1.authenticate, userController_1.getUserById);
router.put("/:id", authMiddleware_1.authenticate, userController_1.updateUser);
router.delete("/:id", authMiddleware_1.authenticate, userController_1.deleteUser);
exports.default = router;
