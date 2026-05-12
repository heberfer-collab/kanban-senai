import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, avatarUrl } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl }, token });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário: ' + (error.message || 'Desconhecido') });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl }, token });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro ao fazer login: ' + (error.message || 'Desconhecido') });
  }
};
