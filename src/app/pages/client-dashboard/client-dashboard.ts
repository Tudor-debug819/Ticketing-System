import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { Observable } from 'rxjs';
import { filter, map, switchMap, shareReplay } from 'rxjs/operators';
import { Ticket } from '../../ticket.model';
import { User } from '../../user.model';

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

@Component({
  selector: 'app-client-dashboard',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.css'
})
export class ClientDashboard implements OnInit {
  stats$!: Observable<TicketStats>;
  recentTickets$!: Observable<Ticket[]>;
  userName?: string;

  constructor(private tickets: TicketService, private auth: AuthService) { }

  ngOnInit(): void {
    const user$ = this.auth.currentUser$.pipe(
      filter((u): u is User => !!u)
    );

    const me = this.auth.currentUser!;
    this.userName = me.name;
    const userTickets$ = this.tickets.getByClient(me.id);

    // nume prietenos în header local component
    user$.subscribe(u => {
      const raw = (u.name?.trim()) || (u.email?.split('@')[0] ?? '');
      this.userName = raw ? raw[0].toUpperCase() + raw.slice(1) : '';
    });

    const userTickets$ = user$.pipe(
      switchMap(u => this.tickets.getByClient(Number(u.id))),
      shareReplay(1)
    );

    //aici se aboneaza o data
    this.stats$ = userTickets$.pipe(
      map(list => ({
        total: list.length,
        open: list.filter(t => t.status === 'open' || t.status === 'new').length,
        inProgress: list.filter(t => t.status === 'in_progress').length,
        resolved: list.filter(t => t.status === 'resolved').length,
        closed: list.filter(t => t.status === 'closed').length,
      }))
    );

    //aici se aboneaza a doua oara
    this.recentTickets$ = userTickets$.pipe(
      map(list =>
        [...list]

          .sort((a, b) =>
            new Date(b.updated_at ?? b.created_at).getTime() -
            new Date(a.updated_at ?? a.created_at).getTime()
          )

          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 3)
      )
    );
    
  }
}
