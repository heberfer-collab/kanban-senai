import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getColumns = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: 'Não autorizado' });

    let columns = await prisma.column.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });

    if (columns.length === 0) {
      // Criar colunas padrão e atualizar tarefas existentes
      const todoCol = await prisma.column.create({ data: { title: 'A Fazer', colorBorder: 'border-slate-300 dark:border-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-800/40', order: 0, userId } });
      const inProgCol = await prisma.column.create({ data: { title: 'Em Progresso', colorBorder: 'border-primary-400 dark:border-primary-600', bgColor: 'bg-primary-50/50 dark:bg-primary-900/10', order: 1, userId } });
      const doneCol = await prisma.column.create({ data: { title: 'Concluído', colorBorder: 'border-emerald-400 dark:border-emerald-600', bgColor: 'bg-emerald-50/50 dark:bg-emerald-900/10', order: 2, userId } });

      await prisma.task.updateMany({ where: { userId, status: 'TODO' }, data: { status: todoCol.id } });
      await prisma.task.updateMany({ where: { userId, status: 'IN_PROGRESS' }, data: { status: inProgCol.id } });
      await prisma.task.updateMany({ where: { userId, status: 'DONE' }, data: { status: doneCol.id } });

      columns = [todoCol, inProgCol, doneCol];
    }

    res.json(columns);
  } catch (error) {
    console.error('Erro ao buscar colunas:', error);
    res.status(500).json({ error: 'Erro ao buscar colunas' });
  }
};

export const createColumn = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: 'Não autorizado' });

    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Título é obrigatório' });

    // Determinar a ordem
    const lastColumn = await prisma.column.findFirst({
      where: { userId },
      orderBy: { order: 'desc' },
    });
    const order = lastColumn ? lastColumn.order + 1 : 0;

    // Cores padrão para novas colunas (uma paleta neutra/legal)
    const colorBorder = 'border-indigo-400 dark:border-indigo-600';
    const bgColor = 'bg-indigo-50/50 dark:bg-indigo-900/10';

    const newColumn = await prisma.column.create({
      data: {
        title,
        order,
        colorBorder,
        bgColor,
        userId,
      },
    });

    res.status(201).json(newColumn);
  } catch (error) {
    console.error('Erro ao criar coluna:', error);
    if ((error as any).code === 'P2002') {
       return res.status(400).json({ error: 'Você já possui uma coluna com este nome.' });
    }
    res.status(500).json({ error: 'Erro ao criar coluna' });
  }
};
