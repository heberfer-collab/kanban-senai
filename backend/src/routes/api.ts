import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask, shareTask, getSharedTask } from '../controllers/taskController';
import { getColumns, createColumn } from '../controllers/columnController';
import { getTags, updateTag, deleteTag } from '../controllers/tagController';
import { getDashboardMetrics } from '../controllers/dashboardController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Rota pública de visualização de tarefa
router.get('/shared/:token', getSharedTask);

// Todas as rotas daqui pra baixo requerem autenticação
router.use(authenticate);

// Dashboard
router.get('/dashboard/metrics', getDashboardMetrics);

// Tasks
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.post('/tasks/:id/share', shareTask);

// Columns
router.get('/columns', getColumns);
router.post('/columns', createColumn);

// Tags (Categories)
router.get('/tags', getTags);
router.put('/tags/:id', updateTag);
router.delete('/tags/:id', deleteTag);

export default router;
