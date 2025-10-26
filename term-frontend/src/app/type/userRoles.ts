export interface UserRoles {
    id: number;
    userId: number;
    organizationId?: number;
    role: 'SYSTEM_ADMIN' | 'ORG_STAFF' | 'USER';
}