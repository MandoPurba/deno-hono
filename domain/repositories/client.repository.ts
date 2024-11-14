import { Client } from '../entities/client.entity.ts';

export interface IClientRepository {
    findByClientId(clientId: string): Promise<Client | null>;
    veryfyClientSecret(
        client: Client,
        clientSecret: string,
    ): Promise<Client | null>;
    create(client: Client): Promise<Client>;
}
