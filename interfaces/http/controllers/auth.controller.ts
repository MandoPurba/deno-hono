import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { VerifyClientUseCase } from '../../../domain/usecase/auth/verify-client.usecase.ts';
import { CreateTokenUseCase } from '../../../domain/usecase/auth/create-token.usecase.ts';

export class AuthController {
    constructor(
        private readonly verifyClientUseCase: VerifyClientUseCase,
        private readonly createTokenUseCase: CreateTokenUseCase,
    ) {}

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
            const client = await this.verifyClientUseCase.execute(client_id, client_secret);

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
