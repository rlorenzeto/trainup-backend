import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise extends Document {
  user: mongoose.Types.ObjectId;
  group: string; // 'A', 'B', 'C', 'D'
  name: string;
  repeticoes: string;
  carga: string;
  gifUrl?: string;
}

const ExerciseSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: String, required: true },
  name: { type: String, required: true },
  repeticoes: { type: String, required: true },
  carga: { type: String, required: true },
  gifUrl: { type: String }
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);
