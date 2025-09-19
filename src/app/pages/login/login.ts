import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  hide = signal(true);
  submitting = signal(false);

  form: FormGroup;

  constructor(private fb: FormBuilder, public authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
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

    const { email, password } = this.form.getRawValue();
    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.authService.navigateAfterLogin(user.role);
      },
      error: (err) => {
        console.warn('Login error:', err?.message || err);
      },
      complete: () => this.submitting.set(false)
    });
  }



}
