import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';


@Component({
  selector: 'app-client-dashboard',
  imports: [Header],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.css'
})
export class ClientDashboard {

}
