import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },

    { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },

    { path: 'sidebar', loadComponent: () => import('./pages/sidebar/sidebar').then(m => m.Sidebar) },

    { path: 'admin-dashboard', canActivate: [authGuard], data: { roles: ['admin'] }, loadComponent: () => import('./pages/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard) },

    { path: 'client-dashboard', canActivate: [authGuard], data: { roles: ['client'] }, loadComponent: () => import('./pages/client-dashboard/client-dashboard').then(m => m.ClientDashboard) },

    { path: 'technician-dashboard', canActivate: [authGuard], data: { roles: ['technician'] }, loadComponent: () => import('./pages/technician-dashboard/technician-dashboard').then(m => m.TechnicianDashboard) },

    { path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound) },

];
