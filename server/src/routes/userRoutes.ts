// server/routes/userRoutes.ts
import express from 'express';
import { getUsers, addUser } from '../controllers/userController.js'; // 👈 must include `.js` when using ESM

const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);

export default router;
