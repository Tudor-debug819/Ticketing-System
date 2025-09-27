import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

@Component({
  selector: 'app-technician-dashboard',
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './technician-dashboard.html',
  styleUrl: './technician-dashboard.css'
})
export class TechnicianDashboard {
  stats = {
    total: 12,
    open: 5,
    inProgress: 4,
    resolved: 3
  };

  recentTickets: Array<{
    id: number;
    title: string;
    status: TicketStatus;
    updatedAt: string; // ISO sau text scurt
  }> = [
      { id: 125, title: 'Phone not charging', status: 'Open', updatedAt: '2025-09-26 10:15' },
      { id: 128, title: 'Screen cracked', status: 'In Progress', updatedAt: '2025-09-26 12:40' },
      { id: 131, title: 'Email not working', status: 'Resolved', updatedAt: '2025-09-25 16:02' },
      { id: 135, title: 'VPN issues', status: 'Open', updatedAt: '2025-09-25 09:33' },
    ];

  badgeClass(s: TicketStatus) {
    switch (s) {
      case 'Open': return 'bg-rose-100 text-rose-700';
      case 'In Progress': return 'bg-amber-100 text-amber-700';
      case 'Resolved': return 'bg-emerald-100 text-emerald-700';
      case 'Closed': return 'bg-slate-200 text-slate-700';
    }
  }

}
