import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';

type Priority = 'low' | 'medium' | 'high' | 'urgent';

@Component({
  selector: 'app-add-ticket',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './add-ticket.html',
  styleUrl: './add-ticket.css'
})
export class AddTicket {

  private fb = inject(FormBuilder);
  private tickets = inject(TicketService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  loading = false;

  form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control<string>('', [Validators.required, Validators.minLength(4)]),
    description: this.fb.nonNullable.control<string>('', [Validators.required, Validators.minLength(10)]),
    priority: this.fb.nonNullable.control<Priority>('medium', Validators.required),
  });

  ngOnInit(): void { }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const me = this.auth.currentUser!;
    const { title, description, priority } = this.form.value;

    this.loading = true;
    this.tickets.create({
      // backend așteaptă snake_case
      client_id: me.id,
      title: title!,
      description: description!,
      priority: priority as 'low' | 'medium' | 'high' | 'urgent',
      // status e opțional în backend; default 'new'
    }).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Ticket created successfully', 'OK', { duration: 2500 });
        this.router.navigate(['/my-tickets']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.snack.open('Failed to create ticket. Please try again.', 'Close', { duration: 3500 });
      }
    });
  }
}
