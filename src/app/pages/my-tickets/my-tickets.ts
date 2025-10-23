import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Ticket } from '../../ticket.model';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { filter, switchMap } from 'rxjs/operators';
import { User } from '../../user.model';

@Component({
  selector: 'app-my-tickets',
  imports: [RouterModule, CommonModule],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css'
})
export class MyTickets implements OnInit {

  tickets$!: Observable<Ticket[]>;
  constructor(private tickets: TicketService, private auth: AuthService) { }


  ngOnInit(): void {
    this.tickets$ = this.auth.currentUser$.pipe(
      filter((u): u is User => !!u),
      switchMap(u => this.tickets.getByClient(Number(u.id)))
    );

    const me = this.auth.currentUser!;
    this.tickets$ = this.tickets.getByClient(me.id);

  }

}
