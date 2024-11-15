import { z } from 'zod';

export const CREATE_CLIENT_DTO_SCHEMA = z.object({
    serviceName: z.string().min(3).max(100),
    companyName: z.string().min(3).max(100),
    environment: z.enum(['production', 'staging', 'development']),
    scope: z.array(z.string()).min(1),
    description: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),

    technicalContact: z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
    }),

    businessContact: z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
    }).optional(),

    metadata: z.object({
        contractId: z.string().optional(),
        department: z.string().optional(),
        project: z.string().optional(),
        notes: z.string().optional(),
    }).optional(),

    expiresAt: z.date().optional(),
});
export type CREATE_CLIENT_DTO = z.infer<typeof CREATE_CLIENT_DTO_SCHEMA>;

export const UPDATE_CLIENT_DTO_SCHEMA = CREATE_CLIENT_DTO_SCHEMA.partial();
export type UPDATE_CLIENT_DTO = z.infer<typeof UPDATE_CLIENT_DTO_SCHEMA>;

export const TOKEN_REQUEST_SCHEMA = z.object({
    client_id: z.string().min(1),
    client_secret: z.string().min(1),
    grant_type: z.literal('client_credentials'),
});
export type TOKE_REQUEST_DTO = z.infer<typeof TOKEN_REQUEST_SCHEMA>;

export const TOKEN_RESPONSE_SCHEMA = z.object({
    access_token: z.string(),
    expires_in: z.number(),
    scope: z.array(z.string()),
    token_type: z.literal('bearer '),
});
export type TOKEN_RESPONSE_DTO = z.infer<typeof TOKEN_RESPONSE_SCHEMA>;
