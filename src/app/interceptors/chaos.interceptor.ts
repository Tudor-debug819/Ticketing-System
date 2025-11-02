import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

function chaosOn() {
    return typeof window !== 'undefined' && localStorage.getItem('CHAOS') === '1';
}

export const chaosMockInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<any>> => {
    if (!chaosOn() || !/\/api\/tickets(\?|$)/.test(req.url)) {
        return next(req);
    }

    return next(req).pipe(
        map(event => {
            if (event instanceof HttpResponse) {
                const badBody = [
                    { id: "1", title: "Display cracked", status: "awaiting_parts", createdAt: "not-an-iso" },
                    { id: 2, title: "Battery issue", /* status lipsă */ priority: "urgentissimo", createdAt: "2025-10-01T10:00:00Z" },
                    { id: 3, title: "Water damage", status: "in_progress", createdAt: null, assignedTo: { id: 7, name: "John" } },
                    { id: 4, title: "No power", status: "closed", createdAt: "2025-09-30T12:00:00Z", extraWeirdField: "🤪" },
                ];

                return event.clone({
                    body: badBody,
                    headers: event.headers.set('X-Contract', 'tickets@2 (CHAOS)')
                });
            }
            return event;
        })
    );
};
