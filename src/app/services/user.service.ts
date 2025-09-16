import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserRole } from "../user.model";

export interface AppUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    password: string;
}

@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(private http: HttpClient) { }
    getUsers(): Observable<AppUser[]> {
        return this.http.get<AppUser[]>('/assets/users.json');
    }
}