import Router from "koa-router";
import { authenticateToken } from "../middleware/authMiddleware";
import { justifyHandler } from "../controllers/justifyController";
import { rateLimiter } from "../middleware/rateLimitMiddleware";
import { wordCountMiddleware } from "../middleware/wordCountMiddleware";

const router = new Router();

/**
 * @swagger
 * /api/justify:
 *   post:
 *     summary: Justify text
 *     description: Takes plain text and returns justified text.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *             example: "Your sample text here."
 *     responses:
 *       200:
 *         description: Successfully justified text.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       402:
 *         description: "Payment Required: Rate limit exceeded."
 */

router.post(
  "/justify",
  authenticateToken,
  wordCountMiddleware,
  rateLimiter,
  justifyHandler
);

export default router;
