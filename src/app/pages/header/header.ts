import { Component, inject, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from '../../services/auth.service';
import { map, Observable } from 'rxjs';
import { RuntimeStateService } from '../../services/runtime-state.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  auth = inject(AuthService);

  offline$!: Observable<boolean>;

  constructor(private state: RuntimeStateService) {
    this.offline$ = this.state.offline$;
  }

  userName$ = this.auth.currentUser$.pipe(
    map(user => {
      if (!user) return null;
      const raw = (user.name?.trim()) || (user.email?.split('@')[0] ?? '');
      return raw ? raw[0].toUpperCase() + raw.slice(1) : null;
    })
  );

  @Output() menuToggle = new EventEmitter<void>();

}
