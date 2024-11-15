import { sign, verify } from 'hono/jwt';

export class JwtAdapter {
    constructor(readonly secret: string) {}

    async sign(
        payload: Record<string, unknown>,
        expiresIn: number,
    ): Promise<string> {
        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(this.secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign'],
        );

        return sign(
            {
                ...payload,
                exp: Math.floor(Date.now() / 1000) + expiresIn,
            },
            key,
            'HS256',
        );
    }

    async verify(token: string): Promise<Record<string, unknown>> {
        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(this.secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify'],
        );

        return await verify(token, key);
    }
}
