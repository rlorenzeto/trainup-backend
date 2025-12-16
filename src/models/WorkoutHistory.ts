import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkoutHistory extends Document {
  user: mongoose.Types.ObjectId;
  workoutId: mongoose.Types.ObjectId;
  durationSeconds: number;
  completedAt: Date;
}

const WorkoutHistorySchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workoutId: { type: Schema.Types.ObjectId, required: true }, // References a Workout (or Exercise) ID
  durationSeconds: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IWorkoutHistory>('WorkoutHistory', WorkoutHistorySchema);