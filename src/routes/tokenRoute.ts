import Router from "koa-router";
import { generateToken } from "../controllers/tokenController";

const router = new Router();
/**
 * @swagger
 * /api/token:
 *   post:
 *     summary: Generate JWT Token
 *     description: Generates a JWT token for authenticated access.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Token generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
 *       400:
 *         description: "Bad Request: Email is required."
 */
router.post("/token", generateToken);

export default router;
