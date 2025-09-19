import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserRole, User } from "../user.model";

@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(private http: HttpClient) { }
    getUsers(): Observable<User[]> {
        console.log('[UserService] fetching /assets/users.json');
        return this.http.get<User[]>('/assets/users.json');
    }
}