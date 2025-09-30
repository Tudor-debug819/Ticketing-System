import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { filter, map, switchMap, take } from 'rxjs/operators';

type ApiStatus = 'new' | 'open' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';

interface ApiTicket {
  id: number | string;       // în caz că vine ca string (BigInt serializat)
  title: string;
  description?: string;
  status: ApiStatus | string;
  updated_at?: string;       
  updatedAt?: string;        
}

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './technician-dashboard.html',
  styleUrl: './technician-dashboard.css'
})
export class TechnicianDashboard implements OnInit {
  private tickets = inject(TicketService);
  private auth = inject(AuthService);

  stats = { total: 0, open: 0, inProgress: 0, resolved: 0 };

  recentTickets: Array<{ id: number; title: string; status: ApiStatus; updatedAt: string }> = [];

  ngOnInit() {
    this.auth.currentUser$
      .pipe(
        filter(u => !!u),        
        take(1),
        switchMap(u => this.tickets.getByTechnician(Number(u!.id))),
        map((rows: ApiTicket[]) =>
          rows.map(r => ({
            id: Number(r.id),
            title: r.title,                            
            status: this.normalizeStatus(r.status),    
            updatedAt: r.updatedAt ?? r.updated_at ?? '' 
          }))
        )
      )
      .subscribe(list => {
        // sortăm descrescător după updatedAt dacă există
        this.recentTickets = [...list].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0, 5);

        this.stats.total = list.length;
        this.stats.open = list.filter(t => t.status === 'open').length;
        this.stats.inProgress = list.filter(t => t.status === 'in_progress').length;
        this.stats.resolved = list.filter(t => t.status === 'resolved').length;
      });
  }

  private normalizeStatus(s: any): ApiStatus {
    if (!s) return 'new';
    const v = String(s).toLowerCase().replace(/\s+/g, '_') as ApiStatus;
    const ro2api: Record<string, ApiStatus> = {
      'nou': 'new',
      'deschis': 'open',
      'în_curs': 'in_progress', 'in_curs': 'in_progress',
      'în_așteptare': 'on_hold', 'in_asteptare': 'on_hold',
      'rezolvat': 'resolved',
      'închis': 'closed', 'inchis': 'closed',
    };
    return (ro2api[v] ?? v) as ApiStatus;
  }

  badgeClass(s: ApiStatus) {
    switch (s) {
      case 'open': return 'bg-rose-100 text-rose-700';
      case 'in_progress': return 'bg-amber-100 text-amber-700';
      case 'resolved': return 'bg-emerald-100 text-emerald-700';
      case 'closed': return 'bg-slate-200 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }
}
