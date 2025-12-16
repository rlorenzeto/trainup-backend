import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Payment from "../models/Payment";
import WorkoutHistory from "../models/WorkoutHistory";

// Helper to calculate monthly percentage
const calculateMonthlyPercentual = async (userId: any) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysInMonth = endOfMonth.getDate();

  const count = await WorkoutHistory.countDocuments({
    user: userId,
    completedAt: { $gte: startOfMonth, $lte: endOfMonth },
  });

  return count / daysInMonth;
};

// Helper to flatten User document
const flattenUser = (user: any, percentual?: number) => {
  return {
    email: user.email,
    nome: user.perfilHeader?.nome,
    matricula: user.perfilHeader?.matricula,
    fotoPerfil: user.perfilHeader?.fotoPerfil,

    percentual:
      percentual !== undefined ? percentual : user.estatisticas?.percentual,
    cpf: user.dadosCadastrais?.cpf,
    dataNascimento: user.dadosCadastrais?.dataNascimento,
    celular: user.dadosAdicionais?.celular,
    endereco: user.dadosAdicionais?.endereco,
    bairro: user.dadosAdicionais?.bairro,
    cidade: user.dadosAdicionais?.cidade,
    estado: user.dadosAdicionais?.estado,
    _id: user._id,
    __v: user.__v,
  };
};

// Helper to nest User data
const nestUser = (body: any) => {
  return {
    email: body.email,
    password: body.password,
    perfilHeader: {
      nome: body.nome,
      fotoPerfil: body.fotoPerfil,
      matricula: body.matricula,
    },
    estatisticas: {
      percentual: body.percentual,
    },
    dadosCadastrais: {
      cpf: body.cpf,
      dataNascimento: body.dataNascimento,
    },
    dadosAdicionais: {
      celular: body.celular,
      endereco: body.endereco,
      bairro: body.bairro,
      cidade: body.cidade,
      estado: body.estado,
    },
  };
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciais inválidas" });
    }

    const hashedPassword = crypto
      .createHash("md5")
      .update(password)
      .digest("hex");
    const isMatch = hashedPassword === user.password;

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret_key_change_me",
      {
        expiresIn: "30d",
      }
    );

    const percentual = await calculateMonthlyPercentual(user._id);

    res.json({
      success: true,
      token,
      data: flattenUser(user, percentual),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Erro ao realizar login",
      error: (err as Error).message,
    });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();

    // Calculate percentual for each user
    const flatUsers = await Promise.all(
      users.map(async (user) => {
        const percentual = await calculateMonthlyPercentual(user._id);
        return flattenUser(user, percentual);
      })
    );

    res.json({ success: true, data: flatUsers });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar usuários" });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Usuário não encontrado" });

    const percentual = await calculateMonthlyPercentual(user._id);

    res.json({ success: true, data: flattenUser(user, percentual) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao buscar usuário" });
  }
};

// Create User
export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = nestUser(req.body);

    // Hash password with MD5
    if (userData.password) {
      userData.password = crypto
        .createHash("md5")
        .update(userData.password)
        .digest("hex");
    }

    const newUser = new User(userData);
    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "secret_key_change_me",
      {
        expiresIn: "30d",
      }
    );

    res
      .status(201)
      .json({ success: true, token, data: flattenUser(newUser, 0) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao criar usuário" });
  }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userData = nestUser(req.body);

    // If password is being updated, hash it with MD5
    if (userData.password) {
      userData.password = crypto
        .createHash("md5")
        .update(userData.password)
        .digest("hex");
    } else {
      delete userData.password; // Don't overwrite with undefined/null if not provided
    }

    const updatedUser = await User.findByIdAndUpdate(id, userData, {
      new: true,
    });
    if (!updatedUser)
      return res
        .status(404)
        .json({ success: false, message: "Usuário não encontrado" });

    const percentual = await calculateMonthlyPercentual(updatedUser._id);

    res.json({ success: true, data: flattenUser(updatedUser, percentual) });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Erro ao atualizar usuário" });
  }
};

// Get Payments for User
export const getUserPayments = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const payments = await Payment.find({ user: id });
    res.json({ success: true, data: payments });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar pagamentos" });
  }
};

// Add Payment for User
export const addPayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const paymentData = { ...req.body, user: id };
    const newPayment = new Payment(paymentData);
    await newPayment.save();
    res.status(201).json({ success: true, data: newPayment });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Erro ao adicionar pagamento" });
  }
};
