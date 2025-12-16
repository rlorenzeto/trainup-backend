import express from 'express';
import * as usersController from '../controllers/usersController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/login', usersController.loginUser);
router.post('/', usersController.createUser); // Register

// Protected routes
router.get('/', protect, usersController.getAllUsers);
router.get('/:id', protect, usersController.getUserById);
router.put('/:id', protect, usersController.updateUser);

// Payment routes (Protected)
router.get('/:id/payments', protect, usersController.getUserPayments);
router.post('/:id/payments', protect, usersController.addPayment);

export default router;
