import express from 'express'
import { refreshAccessToken, signin, signout } from '../controllers/auth.controller.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.post("/signin",signin);
router.post("/signout",signout);
router.post('/refresh-token', refreshAccessToken);


export default router;