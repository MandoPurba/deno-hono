import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { CreateClientUseCase } from '../../../domain/usecase/auth/create-client.usecase.ts';
import { CREATE_CLIENT_DTO } from '../../../domain/dtos/client.dto.ts';
import { VerifyClientUseCase } from '../../../domain/usecase/auth/verify-client.usecase.ts';

export class AuthController {
    constructor(
        private readonly createClientUseCase: CreateClientUseCase,
        private readonly verifyClientUseCase: VerifyClientUseCase,
        private readonly createTokenUseCase: CreateTokenUseCase,
    ) {}

    async createClient(c: Context) {
        try {
            const input = await c.req.json() as CREATE_CLIENT_DTO;
            const result = await this.createClientUseCase.execute(input);

            return c.json({
                status: 'success',
                data: {
                    clientId: result.clientId,
                    clientSecret: result.clientSecret, // Ini hanya muncul sekali
                    serviceName: result.serviceName,
                    scope: result.scope,
                    createdAt: result.createdAt,
                },
            }, 201);
        } catch (error) {
            console.log(error);
            if (error instanceof HTTPException) {
                throw error;
            }
            throw new HTTPException(500, {
                message: 'internal_server_error',
                res: c.json({
                    error: 'server_error',
                    error_description: 'Failed to create client',
                }),
            });
        }
    }

    async createToken(c: Context) {
        try {
            const { client_id, client_secret, grand_type } = await c.req.json();

            if (grand_type !== 'client_credentials') {
                throw new HTTPException(400, {
                    message: 'invalid_grant_type',
                    res: c.json({
                        error: 'invalid_grant_type',
                        error_description: 'invalid_grant_type',
                    }),
                });
            }
            const client = await this.verifyClientUseCase.execute(
                client_id,
                client_secret,
            );

            const token = await this.createTokenUseCase.execute(client);
            return c.json({
                access_token: token.access_token,
                expires_in: token.expires_in,
                scope: token.scope,
                token_type: 'bearer',
            });
        } catch (error) {
            throw error;
        }
    }
}
