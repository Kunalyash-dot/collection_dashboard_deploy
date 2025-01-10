import express from 'express'
import { createDate, deleteDetails, getDetails, updateDetails } from '../controllers/dateUpdate.controller.js';

const router = express.Router();

router.post("/createDetails",createDate)
router.get("/getDetails",getDetails);
router.put("/updateDetails/:id",updateDetails);
router.delete("/deleteDetails/:id",deleteDetails)



export default router;