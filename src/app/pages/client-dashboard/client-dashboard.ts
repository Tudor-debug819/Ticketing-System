import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { Observable, map } from 'rxjs';
import { Ticket } from '../../ticket.model';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}


@Component({
  selector: 'app-client-dashboard',
  imports: [RouterModule, CommonModule, MatIconModule],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.css'
})
export class ClientDashboard implements OnInit {

  stats$!: Observable<TicketStats>;
  recentTickets$!: Observable<Ticket[]>;
  userName?: string;

  constructor(private tickets: TicketService, private auth: AuthService) { }

  ngOnInit(): void {
    const me = this.auth.currentUser!;
    this.userName = me.name;
    const userTickets$ = this.tickets.getByReporter(me.id);



    this.stats$ = userTickets$.pipe(
      map(list => ({
        total: list.length,
        open: list.filter(t => t.status === 'open').length,
        inProgress: list.filter(t => t.status === 'in_progress').length,
        resolved: list.filter(t => t.status === 'resolved').length,
        closed: list.filter(t => t.status === 'closed').length,
      }))
    );

    this.recentTickets$ = userTickets$.pipe(
      map(list =>
        [...list]
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 3)
      )
    );
  }

}
