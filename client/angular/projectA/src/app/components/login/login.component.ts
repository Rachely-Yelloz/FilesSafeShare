import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loading = false;
  error: string = '';

  loginForm: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  private saveUserDetails(token: string) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      if (decodedToken?.id && decodedToken?.name && decodedToken?.email) {
        localStorage.setItem('userId', decodedToken.id);
        localStorage.setItem('username', decodedToken.name);
        localStorage.setItem('useremail', decodedToken.email);
      } else {
        console.error('Missing claims in token');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  onLogin() {
    this.error = '';
    if (this.loginForm.invalid) {
      this.error = 'Please enter both email and password.';
      return;
    }

    this.loading = true;

    const url = 'https://filessafeshare-1.onrender.com/api/Auth/login';
    const requestData = {
      email: this.loginForm.value.email,
      passwordHash: this.loginForm.value.password
    };

    this.http.post<{ token: string }>(url, requestData).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);
        this.saveUserDetails(response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        const defaultMessage = 'Login failed';
        this.error =
          err.error?.title || err.error?.message || defaultMessage;
      }
    });
  }
}
