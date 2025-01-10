import express from 'express'
import { createManager, deleteManager, employeesByBranches, getManager, getManagerData, getSelectedManager, updateManager } from '../controllers/manager.controller.js';

const router = express.Router();

router.post("/create",createManager);
router.put("/updateManager/:id",updateManager)
router.get("/",getManager);
router.post("/emplyessByBranches",employeesByBranches)
router.delete("/deleteManager/:id",deleteManager)
router.get("/selectedManager/:id",getSelectedManager)
router.get("/managerData/:id",getManagerData)


export default router;