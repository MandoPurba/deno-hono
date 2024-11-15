import { JwtAdapter } from '../../../infrastructure/security/jwt.adapter.ts';
import { Client } from '../../entities/client.entity.ts';
import { TokenEntity } from '../../entities/token.entity.ts';

export class CreateTokenUseCase {
    constructor(
        private readonly jwtAdapter: JwtAdapter,
    ) {}
}
