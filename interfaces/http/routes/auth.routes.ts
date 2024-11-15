import { Hono } from 'hono';
import { AuthController } from '../controllers/auth.controller.ts';

export const createAuthRoutes = (authController: AuthController) => {
    const authRoutes = new Hono();

    authRoutes.post('/client', authController.createClient.bind(authController));

    return authRoutes;
};
