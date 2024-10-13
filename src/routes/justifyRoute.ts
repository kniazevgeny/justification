import Router from 'koa-router';
import { justifyHandler } from '../controllers/justifyController';

const router = new Router();

router.post('/justify', justifyHandler);

export default router;