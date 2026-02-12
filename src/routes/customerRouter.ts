import { Router } from "express";
import {
  createCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerById
} from "../controller/customerController";
import { validate } from "../middlewares/validate";
import { createCustomerSchema, updateCustomerSchema, deleteCustomerSchema, getCustomerByIdSchema } from "../schemas/customerSChema";

const router = Router();

router.post("/", validate(createCustomerSchema), createCustomer);
router.get("/id", getCustomerById)
router.get("/", getAllCustomers);
router.put("/:id", validate(updateCustomerSchema), updateCustomer);
router.delete("/:id", validate(deleteCustomerSchema), deleteCustomer);

export default router;
