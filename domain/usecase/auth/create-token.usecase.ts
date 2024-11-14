import { JwtAdapter } from '../../../infrastructure/security/jwt.adapter.ts';
import { Client } from '../../entities/client.entity.ts';
import { TokenEntity } from '../../entities/token.entity.ts';

export class CreateTokenUseCase {
    constructor(
        private readonly jwtAdapter: JwtAdapter,
    ) {}

    async execute(client: Client): Promise<TokenEntity> {
        const token = await this.jwtAdapter.sign({
            client: client.clientId,
            scope: client.scope,
            service: client.serviceName,
        }, 3600);

        return {
            access_token: token,
            expires_in: 3600,
            scope: client.scope,
            clientId: client.clientId,
        };
    }
}
