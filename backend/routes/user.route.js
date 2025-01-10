import express from 'express'
import {createUser,fetchUserByRole,fetchUser,updateUser, deleteUser, branchwise} from '../controllers/user.controller.js'

const router = express.Router();


router.post("/create",createUser);

router.get("/role/:role",fetchUserByRole);
router.get("/",fetchUser);
router.put("/:id",updateUser);
router.delete("/:id",deleteUser);
router.get("/branch",branchwise)

export default router;