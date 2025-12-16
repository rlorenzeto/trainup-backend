import mongoose, { Schema, Document } from 'mongoose';

export interface IPerfilHeader {
  nome: string;
  matricula: string;
  fotoPerfil?: string;
}

export interface IEstatisticas {
  percentual?: number;
}

export interface IDadosCadastrais {
  cpf: string;
  dataNascimento: string;
}

export interface IDadosAdicionais {
  celular: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface IUser extends Document {
  email: string;
  password?: string; // Optional because we might exclude it in queries
  perfilHeader: IPerfilHeader;
  estatisticas: IEstatisticas;
  dadosCadastrais: IDadosCadastrais;
  dadosAdicionais: IDadosAdicionais;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  perfilHeader: {
    nome: { type: String, required: true },
    matricula: { type: String, required: true, unique: true },
    fotoPerfil: { type: String, required: false }
  },
  estatisticas: {
    percentual: { type: Number, required: false, default: 0 }
  },
  dadosCadastrais: {
    cpf: { type: String, required: true },
    dataNascimento: { type: String, required: true }
  },
  dadosAdicionais: {
    celular: { type: String, required: true },
    endereco: { type: String, required: true },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true }
  }
});

export default mongoose.model<IUser>('User', UserSchema);
