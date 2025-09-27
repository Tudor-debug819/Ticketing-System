import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Ticket } from '../../ticket.model';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

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
    const me = this.auth.currentUser!;
    this.tickets$ = this.tickets.getByReporter(me.id);
  }

}
