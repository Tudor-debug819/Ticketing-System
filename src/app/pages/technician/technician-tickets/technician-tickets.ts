import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TicketService } from '../../../services/ticket.service';
import { AuthService } from '../../../services/auth.service';

type ApiStatus = 'new' | 'open' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';
type UiStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

interface ApiTicket {
  id: number | string;
  title: string;
  status: ApiStatus | string;
  created_at?: string;
  createdAt?: string;
  users_tickets_client_idTousers?: { name?: string };
  assigned_to?: number | string | null;
}

interface UiTicket {
  id: number;
  title: string;
  customer: string;
  createdAt: string;
  statusApi: ApiStatus;
  statusLabel: UiStatus; // pentru badge + filtre
  assignedTo: number | null;
  _saving?: boolean;
}

@Component({
  selector: 'app-technician-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './technician-tickets.html',
  styleUrl: './technician-tickets.css'
})
export class TechnicianTickets implements OnInit {
  private ticketsApi = inject(TicketService);
  private auth = inject(AuthService);

  currentTechId: number | null = null;

  search = '';
  statusFilter: 'All' | UiStatus = 'All';

  tickets: UiTicket[] = [];

  ngOnInit() {
    this.auth.currentUser$.subscribe(u => {
      if (!u) return;
      this.currentTechId = Number(u.id);

      // ia toate tichetele (pentru listă “All tickets”)
      this.ticketsApi.getAll().subscribe((rows: ApiTicket[]) => {
        this.tickets = rows.map(r => this.toUiTicket(r));
      });
    });
  }

  // === Helpers de mapare ===
  private toUiTicket(r: ApiTicket): UiTicket {
    const statusApi = this.normalizeStatus(r.status);
    return {
      id: Number(r.id),
      title: r.title, // rămâne exact cum vine din DB (RO)
      customer: r.users_tickets_client_idTousers?.name ?? '—',
      createdAt: r.createdAt ?? r.created_at ?? '',
      statusApi,
      statusLabel: this.apiToUi(statusApi),
      assignedTo: r.assigned_to == null ? null : Number(r.assigned_to),
    };
  }

  private normalizeStatus(s: any): ApiStatus {
    if (!s) return 'new';
    const v = String(s).toLowerCase().replace(/\s+/g, '_');
    const ro2api: Record<string, ApiStatus> = {
      nou: 'new',
      deschis: 'open',
      'în_curs': 'in_progress', 'in_curs': 'in_progress',
      'în_așteptare': 'on_hold', 'in_asteptare': 'on_hold',
      rezolvat: 'resolved',
      'închis': 'closed', inchis: 'closed',
    };
    return (ro2api[v] ?? (v as ApiStatus));
  }

  private apiToUi(s: ApiStatus): UiStatus {
    switch (s) {
      case 'new': return 'Open';
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return 'Open';
    }
  }

  // === Filtrare & UI ===
  get filtered(): UiTicket[] {
    const q = this.search.toLowerCase().trim();
    return this.tickets.filter(t => {
      const byStatus = this.statusFilter === 'All' ? true : t.statusLabel === this.statusFilter;
      const byText = !q || `${t.id} ${t.title} ${t.customer}`.toLowerCase().includes(q);
      return byStatus && byText;
    });
  }

  badgeClass(s: UiStatus) {
    switch (s) {
      case 'Open': return 'bg-rose-300 text-rose-950';
      case 'In Progress': return 'bg-amber-300 text-amber-950';
      case 'Resolved': return 'bg-emerald-300 text-emerald-950';
      case 'Closed': return 'bg-slate-300 text-slate-900';
    }
  }

  trackById(_i: number, t: UiTicket) { return t.id; }

  // === Actions ===

  onChangeStatus(t: UiTicket, apiValue: ApiStatus) {
    if (t._saving || t.statusApi === apiValue) return;

    const prevApi = t.statusApi;
    const prevLabel = t.statusLabel;

    // optimistic
    t.statusApi = apiValue;
    t.statusLabel = this.apiToUi(apiValue);
    t._saving = true;

    this.ticketsApi.update(t.id, { status: apiValue }).subscribe({
      next: () => { t._saving = false; },
      error: () => {
        // revert dacă a eșuat
        t.statusApi = prevApi;
        t.statusLabel = prevLabel;
        t._saving = false;
        console.error('Failed to update status');
      }
    });
  }

  assignToMe(t: UiTicket) {
    if (t.assignedTo !== null || this.currentTechId == null) return;
    this.ticketsApi.update(t.id, { assigned_to: this.currentTechId }).subscribe(updated => {
      t.assignedTo = this.currentTechId!;
    });
  }
}
