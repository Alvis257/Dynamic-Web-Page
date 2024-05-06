import { Injectable } from '@angular/core';
import { UserService } from './User.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users = [
    { username: 'simple', password: 'password', role: 'user', email: 'simple@example.com' },
    { username: 'admin', password: 'password', role: 'admin', email: 'admin@example.com' }
  ];

  constructor(private userService: UserService) { }

  login(username: string, password: string): Promise<boolean> {
    const users = this.userService.getUsers();
    return new Promise((resolve, reject) => {
      const user = this.users.find(u => u.username === username && u.password === password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        //this.setSessionTimeout();
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    clearTimeout(Number(localStorage.getItem('sessionTimeoutId')));
  }

sendResetCode(email: string): { resetCode: string; resetSent: boolean; } | null {
    const user = this.users.find(u => u.email === email);
    if (user) {
        // Generate a reset code and return it
        const resetCode = Math.random().toString(36).substring(2, 15);
        const resetSent = true;
        const reset = { resetCode, resetSent };
        return reset;
    }
    return null;
}

resetPassword(newPassword: string): void {
    // Reset the password
}

  forgotPassword(username: string): string {
    const user = this.users.find(u => u.username === username);
    if (user) {
      return `Password reset link has been sent to ${user.email}`;
    }
    return `User not found`;
  }

//   setSessionTimeout(): void {
//     const timeoutId = setTimeout(() => {
//       alert('Session has expired. Please log in again.');
//       this.logout();
//     }, 0); // 1 hour
//     localStorage.setItem('sessionTimeoutId', String(timeoutId));
//   }

//   resetSessionTimeout(): void {
//     clearTimeout(Number(localStorage.getItem('sessionTimeoutId')));
//     this.setSessionTimeout();
//   }
}