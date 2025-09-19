export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt: string;
    updatedAt: string;
    assignedId?: number; // User ID of the technician
    reporterId: number; // User ID of the client
}