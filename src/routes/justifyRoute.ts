import Router from "koa-router";
import { authenticateToken } from "../middleware/authMiddleware";
import { justifyHandler } from "../controllers/justifyController";
import { rateLimiter } from "../middleware/rateLimitMiddleware";
import { wordCountMiddleware } from "../middleware/wordCountMiddleware";

const router = new Router();

router.post(
  "/justify",
  authenticateToken,
  wordCountMiddleware,
  rateLimiter,
  justifyHandler
);

export default router;
