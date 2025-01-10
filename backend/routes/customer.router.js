import express from 'express'
import { createCustomer, deleteCustomer, employeeWiseCustomerData, fetchCustomer, managerWiseCustomerData, stateWiseCustomerData, updateCustomer } from '../controllers/customer.contoller.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router()

router.post("/create",createCustomer);
router.get("/employee/:employeeId",employeeWiseCustomerData);
router.get("/manager/:managerId",managerWiseCustomerData);
router.get("/:state",stateWiseCustomerData);
router.get("/",authorize(["Admin","StateHead","Manager","Employee"]),fetchCustomer);
router.put("/update/:customerId",updateCustomer)
router.delete("/:id",deleteCustomer)

export default router;