import Router from 'koa-router';
import { generateToken } from '../controllers/tokenController';

const router = new Router();

router.post('/token', generateToken);

export default router;
