import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

interface Ticket {
  id: number;
  title: string;
  customer: string;
  createdAt: string;
  status: TicketStatus;
  assignedTo: number | null; // null = neasignat
}

@Component({
  selector: 'app-technician-tickets',
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './technician-tickets.html',
  styleUrl: './technician-tickets.css'
})
export class TechnicianTickets {

  currentTechId = 1;           // mock: tehnicianul logat
  search = '';
  statusFilter: 'All' | TicketStatus = 'All';

  tickets: Ticket[] = [
    { id: 125, title: 'Phone not charging', customer: 'Ana I.', createdAt: '2025-09-26 10:15', status: 'Open', assignedTo: null },
    { id: 128, title: 'Screen cracked', customer: 'Mihai P.', createdAt: '2025-09-26 12:40', status: 'In Progress', assignedTo: 1 },
    { id: 131, title: 'Email not working', customer: 'SC X SRL', createdAt: '2025-09-25 16:02', status: 'Resolved', assignedTo: 2 },
    { id: 135, title: 'VPN issues', customer: 'Ion C.', createdAt: '2025-09-25 09:33', status: 'Open', assignedTo: null },
  ];

  get filtered(): Ticket[] {
    const q = this.search.toLowerCase().trim();
    return this.tickets.filter(t => {
      const byStatus = this.statusFilter === 'All' ? true : t.status === this.statusFilter;
      const byText = !q || `${t.id} ${t.title} ${t.customer}`.toLowerCase().includes(q);
      return byStatus && byText;
    });
  }

  assignToMe(t: Ticket) {
    if (t.assignedTo === null) t.assignedTo = this.currentTechId;
  }

  trackById(_i: number, t: Ticket) { return t.id; }

  badgeClass(s: TicketStatus) {
    switch (s) {
      case 'Open': return 'bg-rose-300 text-rose-950';
      case 'In Progress': return 'bg-amber-300 text-amber-950';
      case 'Resolved': return 'bg-emerald-300 text-emerald-950';
      case 'Closed': return 'bg-slate-300 text-slate-900';
    }
  }
}
