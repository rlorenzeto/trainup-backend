import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  mes: string;
  dataVenc: string;
  valor: string;
  status: 'aberto' | 'pago';
  user: mongoose.Types.ObjectId; // Reference to User
}

const PaymentSchema: Schema = new Schema({
  mes: { type: String, required: true },
  dataVenc: { type: String, required: true },
  valor: { type: String, required: true },
  status: { type: String, enum: ['aberto', 'pago'], required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
