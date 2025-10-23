export type UserRole = 'admin' | 'technician' | 'client';

export interface User {
    id: number | string;
    name: string;
    email: string;
    role: UserRole;
    token: string;
}