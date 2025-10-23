import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  hide = signal(true);
  submitting = signal(false);
  serverError = signal<string | null>(null);
  canWorkOffline = false;

  form: FormGroup;

  constructor(private fb: FormBuilder, public authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.form.valueChanges.subscribe(() => this.serverError.set(null));
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => console.log('Current user:', user));
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.serverError.set(null);
    this.canWorkOffline = false;

    const { email, password } = this.form.getRawValue();
    this.authService.login(email, password).pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: (user) => {
        this.authService.navigateAfterLogin(user.role);
      },
      error: (err) => {
        const status = err?.status ?? 0;
        if (status === 401) {
          this.serverError.set('Email sau parolă incorecte.');
        } else if (status === 403) {
          this.serverError.set('Nu ai permisiuni pentru această aplicație.');
        } else {
          this.serverError.set('Server indisponibil. Nu te poți autentifica acum.');
          this.canWorkOffline = !!localStorage.getItem('last_user');
        }
      },
    });
  }

  enterOffline() {
    if (this.authService.enterOfflineIfPossible()) {
      const user = this.authService.currentUser!;
      this.authService.navigateAfterLogin(user.role);
    }
  }



}
