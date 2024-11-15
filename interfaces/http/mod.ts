import { Hono } from 'hono';
import { createAuthRoutes } from './routes/auth.routes.ts';
import { AuthController } from './controllers/auth.controller.ts';
import { VerifyClientUseCase } from '../../domain/usecase/auth/verify-client.usecase.ts';
import { CreateTokenUseCase } from '../../domain/usecase/auth/create-token.usecase.ts';
import { ClientRepository } from '../../infrastructure/repositories/client.repository.ts';
import { MongoAdapter } from '../../infrastructure/database/mongo.adapter.ts';
import { JwtAdapter } from '../../infrastructure/security/jwt.adapter.ts';
import { CreateClientUseCase } from '../../domain/usecase/auth/create-client.usecase.ts';

class DIContainer {
    private container: Map<string, unknown> = new Map();

    register(name: string, value: unknown): void {
        this.container.set(name, value);
    }

    get<T>(name: string): T {
        const resolved = this.container.get(name);
        if (!resolved) {
            throw new Error(`Dependency ${name} not found`);
        }
        return resolved as T;
    }
}

const container = new DIContainer();
// Infrastructure
container.register(
    'MongoAdapter',
    new MongoAdapter(
        Deno.env.get('MONGO_URL') ??
            'mongodb://root:example@localhost:27017/deno_hono?authSource=admin',
    ),
);

// Repositories
container.register(
    'ClientRepository',
    new ClientRepository(container.get<MongoAdapter>('MongoAdapter')),
);

// UseCases
container.register(
    'CreateClientUseCase',
    new CreateClientUseCase(container.get<ClientRepository>('ClientRepository')),
);
container.register(
    'VerifyClientUseCase',
    new VerifyClientUseCase(container.get<ClientRepository>('ClientRepository')),
);

// Container
container.register(
    'AuthController',
    new AuthController(
        container.get<CreateClientUseCase>('CreateClientUseCase'),
        container.get<VerifyClientUseCase>('VerifyClientUseCase'),
    ),
);

export class HttpModule {
    authRoutes(app: Hono) {
        const authController = container.get<AuthController>('AuthController');
        app.route(
            'auth',
            createAuthRoutes(authController),
        );
    }

    init(): Hono {
        const router = new Hono();
        this.authRoutes(router);
        return router;
    }
}
