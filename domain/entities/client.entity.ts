export enum ClientStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}

export interface Client {
    id: string;
    clientId: string;
    clientSecret: string;
    serviceName: string;
    status: ClientStatus;

    // Informasi dasar
    companyName: string; // Nama perusahaan
    description?: string; // Deskripsi penggunaan
    environment: 'production' | 'staging' | 'development';

    // Kontrol akses
    scope: string[]; // Permission yang diberikan

    // Kontak dan monitoring
    technicalContact: { // Kontak teknis
        name: string;
        email: string;
        phone?: string;
    };
    businessContact?: { // Kontak bisnis (opsional)
        name: string;
        email: string;
        phone?: string;
    };

    // Audit dan monitoring
    lastAccessAt?: Date; // Akses terakhir
    expiresAt?: Date; // Tanggal expired (opsional)
    metadata?: {
        contractId?: string; // ID kontrak/perjanjian
        department?: string; // Departemen yang bertanggung jawab
        project?: string; // Nama project
        notes?: string; // Catatan tambahan
    };

    // Timestamp
    createdAt: Date;
    updatedAt: Date;
}
