import { Hono } from 'hono';
import { AuthController } from '../controllers/auth.controller.ts';

export const createAuthRoutes = (authController: AuthController) => {
    const authRoutes = new Hono();

    authRoutes.post('/token', authController.createToken);

    return authRoutes;
};
