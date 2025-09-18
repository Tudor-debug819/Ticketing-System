import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Ticket } from "../ticket.model";
import { map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })

export class TicketService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>('/assets/tickets.json');
    }

    getByReporter(reporterId: number): Observable<Ticket[]> {
        return this.getAll().pipe(map(list => list.filter(ticket => ticket.reporterId === reporterId)));
    }

    getByAssignee(assignedId: number): Observable<Ticket[]> {
        return this.getAll().pipe(map(list => list.filter(ticket => ticket.assignedId === assignedId)));
    }
}