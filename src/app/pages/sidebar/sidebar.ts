import { Component, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Header } from '../header/header';

type Role = 'admin' | 'technician' | 'client';
type NavItem = { label: string; icon: string; link: string; roles?: Role[] }

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatListModule, MatButtonModule, Header],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  opened = signal(true);

  constructor(private authService: AuthService) { }

  private allItems: NavItem[] = [
    { label: 'Dashboard', icon: 'space_dashboard', link: '/admin-dashboard', roles: ['admin'] },
    { label: 'Dashboard', icon: 'space_dashboard', link: '/technician-dashboard', roles: ['technician'] },
    { label: 'Dashboard', icon: 'space_dashboard', link: '/client-dashboard', roles: ['client'] },
    { label: 'Tickets', icon: 'confirmation_number', link: '/tickets', roles: ['admin', 'technician'] },
    { label: 'My tickets', icon: 'assignment', link: '/my-tickets', roles: ['client', 'technician'] },
    { label: 'Settings', icon: 'settings', link: '/settings' }
  ];

  role = computed<Role | null>(() => this.authService.role ?? null);

  items = computed(() => {
    const r = this.role();
    return this.allItems.filter(i => !i.roles || (r && i.roles.includes(r)));
  });
}
