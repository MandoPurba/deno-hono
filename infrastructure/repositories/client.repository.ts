import { Client } from '../../domain/entities/client.entity.ts';
import { IClientRepository } from '../../domain/repositories/client.repository.ts';
import { MongoAdapter } from '../database/mongo.adapter.ts';

export class ClientRepository implements IClientRepository {
    constructor(readonly client: MongoAdapter) {}
    create(client: Client): Promise<Client> {
        const collection = this.client.getDatabase('my-app').collection<Client>('clients').insertOne(client);
        return collection.then((result) => result.ops[0]);
    }
    async findByClientId(clientId: string): Promise<Client | null> {
        const collection = this.client.getDatabase('my-app').collection<Client>('clients');
        return await collection.findOne({ clientId });
    }
    veryfyClientSecret(client: Client, clientSecret: string): Promise<Client | null> {
        return Promise.resolve(client);
    }
}
