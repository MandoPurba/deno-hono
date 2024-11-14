import { Hono } from 'hono';
import { createAuthRoutes } from './routes/auth.routes.ts';
import { AuthController } from './controllers/auth.controller.ts';
import { VerifyClientUseCase } from '../../domain/usecase/auth/verify-client.usecase.ts';
import { CreateTokenUseCase } from '../../domain/usecase/auth/create-token.usecase.ts';
import { ClientRepository } from '../../infrastructure/repositories/client.repository.ts';
import { MongoAdapter } from '../../infrastructure/database/mongo.adapter.ts';
import { JwtAdapter } from '../../infrastructure/security/jwt.adapter.ts';

export class HttpModule {
    authRoutes(app: Hono) {
        app.route(
            'auth',
            createAuthRoutes(
                new AuthController(
                    new VerifyClientUseCase(new ClientRepository(new MongoAdapter('mongodb://localhost:27017'))),
                    new CreateTokenUseCase(new JwtAdapter('secret')),
                ),
            ),
        );
    }

    init(): Hono {
        const router = new Hono();
        this.authRoutes(router);
        return router;
    }
}
