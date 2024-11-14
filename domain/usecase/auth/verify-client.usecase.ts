import { Client } from '../../entities/client.entity.ts';
import { IClientRepository } from '../../repositories/client.repository.ts';

export class VerifyClientUseCase {
    constructor(private readonly clientRepository: IClientRepository) {}

    async execute(clientId: string, clientSecret: string): Promise<Client> {
        const client = await this.clientRepository.findByClientId(clientId);
        if (!client) {
            throw new Error('Client not found');
        }
        const isValid = await this.clientRepository.veryfyClientSecret(client, clientSecret);
        if (!isValid) {
            throw new Error('Client secret is invalid');
        }
        return client;
    }
}
