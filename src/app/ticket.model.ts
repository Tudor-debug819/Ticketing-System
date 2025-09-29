export type TicketStatus = 'new' | 'open' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    created_at: string;
    updated_at: string;
    assigneed_to?: number; // User ID of the technician
    client_id: number; // User ID of the client
}