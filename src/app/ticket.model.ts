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
    assignedTo?: number; // User ID of the technician
    createdBy: number; // User ID of the client
}