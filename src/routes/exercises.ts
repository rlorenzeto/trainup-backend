import express from 'express';
import * as exercisesController from '../controllers/exercisesController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Get exercises for a user
router.get('/user/:userId', protect, exercisesController.getUserExercises);

// Add exercise to user
router.post('/user/:userId', protect, exercisesController.addExercise);

// Update/Delete exercise
router.put('/:id', protect, exercisesController.updateExercise);
router.delete('/:id', protect, exercisesController.deleteExercise);

export default router;