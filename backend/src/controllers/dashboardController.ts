import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getDashboardMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const now = new Date();
    
    const totalTasks = await prisma.task.count({ where: { userId } });
    const doneTasks = await prisma.task.count({ where: { userId, status: 'DONE' } });
    
    const overdueTasks = await prisma.task.count({
      where: {
        userId,
        status: { not: 'DONE' },
        dueDate: { lt: now }
      }
    });

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const todayTasks = await prisma.task.count({
      where: {
        userId,
        status: { not: 'DONE' },
        dueDate: { gte: startOfDay, lte: endOfDay }
      }
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const completedLast7Days = await prisma.task.count({
      where: {
        userId,
        status: 'DONE',
        updatedAt: { gte: sevenDaysAgo }
      }
    });

    const upcomingTasks = await prisma.task.findMany({
      where: {
        userId,
        status: { not: 'DONE' },
        dueDate: { not: null, gte: startOfDay }
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
      include: {
        tags: { include: { tag: true } }
      }
    });

    // Tarefas por Categoria (para o gráfico) usando GroupBy
    const tasksByCategory = await prisma.task.groupBy({
      by: ['category'],
      where: { userId },
      _count: { category: true }
    });

    const colorMap: Record<string, string> = {
      'TRABALHO': '#3b82f6',
      'PESSOAL': '#8b5cf6',
      'ESTUDOS': '#10b981',
      'CASA': '#f59e0b'
    };

    const chartData = tasksByCategory.map(t => ({
      name: t.category,
      value: t._count.category,
      color: colorMap[t.category] || '#94a3b8'
    }));

    res.json({
      metrics: { totalTasks, doneTasks, overdueTasks, todayTasks, completedLast7Days },
      upcomingTasks,
      chartData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar métricas do dashboard.' });
  }
};
