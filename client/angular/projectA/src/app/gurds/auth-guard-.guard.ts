// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // בדיקה אם יש טוקן/נתון בלוקלסטורג
    const token = localStorage.getItem('authToken'); // שנה לפי שם הנתון שלך
    if (token) {
      return true; // יש נתונים, מאפשר כניסה
    } else {
      this.router.navigate(['/login']); // אין נתונים, מפנה לעמוד התחברות
      return false;
    }
  }
}
