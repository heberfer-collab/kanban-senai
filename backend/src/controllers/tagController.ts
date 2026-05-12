import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getTags = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;

    const tags = await prisma.tag.findMany({
      where: { userId },
      include: {
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tags);
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias (tags).' });
  }
};

export const updateTag = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome é obrigatório.' });

    const tag = await prisma.tag.findFirst({ where: { id, userId } });
    if (!tag) return res.status(404).json({ error: 'Tag não encontrada.' });

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: { name }
    });

    res.json(updatedTag);
  } catch (error) {
    console.error('Erro ao atualizar tag:', error);
    res.status(500).json({ error: 'Erro ao atualizar a categoria (tag).' });
  }
};

export const deleteTag = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const tag = await prisma.tag.findFirst({ where: { id, userId } });
    if (!tag) return res.status(404).json({ error: 'Tag não encontrada.' });

    await prisma.tag.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar tag:', error);
    res.status(500).json({ error: 'Erro ao excluir a categoria (tag).' });
  }
};
