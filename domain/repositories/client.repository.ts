import { CREATE_CLIENT_DTO } from '../dtos/client.dto.ts';
import { Client } from '../entities/client.entity.ts';

export interface IClientRepository {
    // findByClientId(clientId: string): Promise<Client | null>;
    // veryfyClientSecret(
    //     client: Client,
    //     clientSecret: string,
    // ): Promise<Client | null>;
    create(createClientDto: CREATE_CLIENT_DTO): Promise<Client>;
}
