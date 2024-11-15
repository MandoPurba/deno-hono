import { CREATE_CLIENT_DTO } from '../../domain/dtos/client.dto.ts';
import { Client, ClientStatus } from '../../domain/entities/client.entity.ts';
import { IClientRepository } from '../../domain/repositories/client.repository.ts';
import { MongoAdapter } from '../database/mongo.adapter.ts';
import { Collection, MongoError, ObjectId } from 'mongodb';

export class ClientRepository implements IClientRepository {
    private readonly collection: Collection<Client>;
    constructor(readonly mongoAdapter: MongoAdapter) {
        this.collection = this.mongoAdapter
            .getDatabase('my-app')
            .collection<Client>('clients');
    }

    async create(createClientDto: CREATE_CLIENT_DTO): Promise<Client> {
        try {
            const { clientId, clientSecret } = this.generateClientCredentials();

            const client: Client = {
                ...createClientDto,
                id: new ObjectId().toString(),
                clientId,
                clientSecret: this.hashSercret(clientSecret),
                status: ClientStatus.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await this.collection.insertOne(client);
            if (!result.acknowledged) {
                throw new Error('Failed to create client');
            }
            return {
                ...client,
                clientSecret, //
            };
        } catch (error) {
            // Type guard untuk MongoError
            if (error && typeof error === 'object' && 'code' in error) {
                const mongoError = error as MongoError;
                if (mongoError.code === 11000) {
                    throw new Error(
                        'Client with this identifier already exists',
                    );
                }
            }

            // Jika error adalah instance of Error
            if (error instanceof Error) {
                throw new Error(`Failed to create client: ${error.message}`);
            }

            // Fallback untuk unknown errors
            throw new Error('An unknown error occurred while creating client');
        }
    }

    private generateClientCredentials() {
        return {
            clientId: crypto.randomUUID().replace(/-/g, ''),
            clientSecret: crypto.randomUUID().replace(/-/g, '') +
                crypto.randomUUID().replace(/-/g, ''),
        };
    }

    private hashSercret(secret: string) {
        // Menggunakan SubtleCrypto dari Deno
        const encoder = new TextEncoder();
        const data = encoder.encode(secret);
        return Array.from(new Uint8Array(data))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
    }
}
