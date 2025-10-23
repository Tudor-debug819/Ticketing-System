import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Ticket } from "../ticket.model";
import { environment } from "../../environments/environment";
import { tap, catchError } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TicketService {
    private apiUrl = `${environment.apiUrl}/tickets`;

    constructor(private http: HttpClient) { }

    // ==== Helpers pentru cache ====
    private keyForClient(clientId: number) { return `tickets_client_${clientId}`; }
    private readCache(clientId: number): Ticket[] {
        try { return JSON.parse(localStorage.getItem(this.keyForClient(clientId)) || '[]'); }
        catch { return []; }
    }
    private writeCache(clientId: number, list: Ticket[]) {
        localStorage.setItem(this.keyForClient(clientId), JSON.stringify(list));
    }

    // toate tichetele (opțional – dacă ai view global)
    getAll(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(this.apiUrl);
    }

    // tichete pentru client – ONLINE => scrie cache; OFFLINE => citește cache
    getByClient(clientId: number): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.apiUrl}/client/${clientId}`).pipe(
            tap(list => this.writeCache(clientId, list)),
            // dacă eșuează rețeaua/ CORS/ server down, folosim cache-ul
            catchError(() => of(this.readCache(clientId)))
        );
    }

    // tichete pentru tehnician (poți face analog pentru cache pe tehnician dacă vrei)
    getByTechnician(technicianId: number): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.apiUrl}/technician/${technicianId}`);
    }

    getById(ticketId: number): Observable<Ticket> {
        return this.http.get<Ticket>(`${this.apiUrl}/${ticketId}`);
    }

    create(ticket: {
        client_id: number;
        title: string;
        description: string;
        priority?: 'low' | 'medium' | 'high' | 'urgent';
        assigned_to?: number | null;
        status?: 'new' | 'open' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';
    }) {
        return this.http.post(`${this.apiUrl}`, ticket);
    }

    addComment(ticketId: number, comment: { author_id: number; body: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/${ticketId}/comments`, comment);
    }

    update(ticketId: number, data: { status?: string; assigned_to?: number }): Observable<Ticket> {
        return this.http.patch<Ticket>(`${this.apiUrl}/${ticketId}`, data);
    }
}
