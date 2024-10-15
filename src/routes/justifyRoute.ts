import Router from 'koa-router';
import { authenticateToken } from '../middleware/authMiddleware';
import { justifyHandler } from '../controllers/justifyController';

const router = new Router();

router.post('/justify', authenticateToken, justifyHandler);

export default router;