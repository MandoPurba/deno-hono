export interface Client {
    id: string;
    clientId: string;
    clientSecret: string;
    serviceName: string;
    scope: string[];
    createdAt: Date;
    updatedAt: Date;
}
