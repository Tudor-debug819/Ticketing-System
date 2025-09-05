import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },

    { path: 'admin-dashboard', loadComponent: () => import('./pages/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard) },

    { path: 'client-dashboard', loadComponent: () => import('./pages/client-dashboard/client-dashboard').then(m => m.ClientDashboard) },

    { path: 'technician-dashboard', loadComponent: () => import('./pages/technician-dashboard/technician-dashboard').then(m => m.TechnicianDashboard) },

    { path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound) },

];
