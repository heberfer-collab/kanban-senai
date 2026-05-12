import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: {
        tags: { include: { tag: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { title, description, dueDate, priority, status, category, tagNames = [] } = req.body;
    
    console.log('Recebendo tarefa:', { title, tagNames, category });

    // 1. Garantir que as Tags existam e pegar os IDs
    const finalTagNames = Array.isArray(tagNames) ? [...tagNames] : [];
    
    // Fallback: Se não vieram tags, mas veio categoria, adiciona a categoria como tag
    if (finalTagNames.length === 0 && category) {
      finalTagNames.push(category);
    }

    const tagIds = [];
    for (const name of finalTagNames) {
      try {
        const tag = await prisma.tag.upsert({
          where: { name_userId: { name, userId } },
          update: {},
          create: { name, userId }
        });
        tagIds.push(tag.id);
      } catch (e) {
        console.error('Erro ao processar tag:', name, e);
      }
    }

    // 2. Criar a tarefa e as conexões TaskTag
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'MEDIUM',
        status: status || 'TODO',
        category: category || 'TRABALHO',
        userId,
        tags: {
          create: tagIds.map(tagId => ({ tagId }))
        }
      },
      include: { tags: { include: { tag: true } } }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;
    const { title, description, dueDate, priority, status, category, tagNames } = req.body;

    const updateData: any = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      status,
      category,
    };

    if (tagNames) {
      // 1. Garantir que as tags existam
      const tagIds = [];
      for (const name of tagNames) {
        const tag = await prisma.tag.upsert({
          where: { name_userId: { name, userId } },
          update: {},
          create: { name, userId }
        });
        tagIds.push(tag.id);
      }

      // 2. Atualizar conexões
      updateData.tags = {
        deleteMany: {}, // Limpa conexões antigas desta tarefa
        create: tagIds.map(tagId => ({ tagId }))
      };
    }

    const task = await prisma.task.update({
      where: { id, userId },
      data: updateData,
      include: { tags: { include: { tag: true } } }
    });

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    await prisma.task.delete({
      where: { id, userId }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar tarefa.' });
  }
};

import crypto from 'crypto';

export const shareTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const task = await prisma.task.findUnique({ where: { id, userId } });
    
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    const shareToken = task.shareToken || crypto.randomBytes(16).toString('hex');

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        isPublic: true,
        shareToken
      }
    });

    res.json({ shareToken: updatedTask.shareToken });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar link de compartilhamento.' });
  }
};

export const getSharedTask = async (req: Request, res: Response) => {
  try {
    const token = req.params.token as string;

    const task = await prisma.task.findUnique({
      where: { shareToken: token, isPublic: true },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        tags: { include: { tag: true } }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada ou não é mais pública.' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tarefa compartilhada.' });
  }
};
