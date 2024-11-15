import { MongoClient } from 'mongodb';

export class MongoAdapter {
    private client: MongoClient;

    constructor(readonly uri: string) {
        this.client = new MongoClient(uri);
        this.client.connect();
    }

    async connect(): Promise<void> {
        await this.client.connect();
    }

    getDatabase(name: string) {
        return this.client.db(name);
    }
}
