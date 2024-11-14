export interface TokenEntity {
    access_token: string;
    expires_in: number;
    scope: string[];
    clientId: string;
}
