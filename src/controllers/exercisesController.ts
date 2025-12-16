import { Request, Response } from 'express';
import Exercise from '../models/Exercise';

// Get exercises for a user
export const getUserExercises = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const exercises = await Exercise.find({ user: userId });
    // Group by 'group' (A, B, C...)
    const groupedExercises = exercises.reduce((acc: any, exercise) => {
      const group = exercise.group;
      if (!acc[group]) acc[group] = [];
      acc[group].push(exercise);
      return acc;
    }, {});
    
    res.json({ success: true, data: groupedExercises });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao buscar exercícios' });
  }
};

// Add exercise to user
export const addExercise = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const exerciseData = { ...req.body, user: userId };
    const newExercise = new Exercise(exerciseData);
    await newExercise.save();
    res.status(201).json({ success: true, data: newExercise });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao adicionar exercício' });
  }
};

// Update exercise
export const updateExercise = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedExercise) return res.status(404).json({ success: false, message: 'Exercício não encontrado' });
    res.json({ success: true, data: updatedExercise });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao atualizar exercício' });
  }
};

// Delete exercise
export const deleteExercise = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedExercise = await Exercise.findByIdAndDelete(id);
    if (!deletedExercise) return res.status(404).json({ success: false, message: 'Exercício não encontrado' });
    res.json({ success: true, message: 'Exercício removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao remover exercício' });
  }
};