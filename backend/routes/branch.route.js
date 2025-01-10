import express from 'express'
import { createBranch,deleteBranch,fetchAllBranches, stateWise, updateBranch } from '../controllers/branch.controller.js';

const router = express.Router();

router.get("/",fetchAllBranches)
router.post("/create",createBranch);
router.put("/:id",updateBranch);
router.delete("/:id",deleteBranch)
router.get('/statewise',stateWise)



export default router;