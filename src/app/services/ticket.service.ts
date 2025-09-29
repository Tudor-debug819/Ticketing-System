import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Ticket } from "../ticket.model";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class TicketService {
    private apiUrl = `${environment.apiUrl}/tickets`; // backend-ul NestJS

    constructor(private http: HttpClient) { }

    // ia toate tichetele
    getAll(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(this.apiUrl);
    }

    // ia tichetele pentru un client
    getByClient(clientId: number): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.apiUrl}/client/${clientId}`);
    }

    // ia tichetele pentru un tehnician
    getByTechnician(technicianId: number): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.apiUrl}/technician/${technicianId}`);
    }

    // ia un singur ticket cu comentarii + useri
    getById(ticketId: number): Observable<Ticket> {
        return this.http.get<Ticket>(`${this.apiUrl}/${ticketId}`);
    }

    // crează un ticket
    create(ticket: Partial<Ticket>): Observable<Ticket> {
        return this.http.post<Ticket>(this.apiUrl, ticket);
    }

    // adaugă comentariu la un ticket
    addComment(ticketId: number, comment: { author_id: number; body: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/${ticketId}/comments`, comment);
    }

    // update status / assigned_to
    update(ticketId: number, data: { status?: string; assigned_to?: number }): Observable<Ticket> {
        return this.http.patch<Ticket>(`${this.apiUrl}/${ticketId}`, data);
    }
}
