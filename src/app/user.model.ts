export type UserRole = 'admin' | 'technician' | 'client';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    token: string;
}