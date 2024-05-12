import { Injectable } from '@angular/core';
import { UserService } from './User.service';
import { User } from '../Interface/User';
import * as emailjs from 'emailjs-com';
import { Console } from 'console';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private users = [
  //   { username: 'simple', password: 'password', role: 'user', resetCode:'', email: 'simple@example.com' },
  //   { username: 'admin', password: 'password', role: 'admin', resetCode:'',email: 'admin@example.com' }
  // ];

  constructor(private userService: UserService) { 
    emailjs.init('LHO-vWp0D8DksFeYw');
  }

  login(username: string, password: string): Promise<boolean> {
    const users = this.userService.getUsers();
    return new Promise((resolve, reject) => {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        sessionStorage.setItem('username', user.username);
        sessionStorage.setItem('rights', JSON.stringify(user.rights));
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    clearTimeout(Number(localStorage.getItem('sessionTimeoutId')));
  }

  getUserByEmail(email: string): User | null {
    const users = this.userService.getUsers();
    const user = users.find(u => u.email === email);
    return user || null;
  }

  async sendResetCode(email: string): Promise<{ resetCode: string; resetSent: boolean; } | null> {
    const users = this.userService.getUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      // Generate a reset code and return it
      const resetCode = Math.random().toString(36).substring(2, 15);
      const resetSent = await this.sendEmail(email, resetCode);
      if (resetSent) {
        this.userService.updateResetCode(user.username, resetCode);
      }
      return { resetCode, resetSent };
    }
    return null;
  }
  
  sendEmail(to: string, resetCode: string): Promise<any> {
    const templateParams = {
      to_name: to,
      message: resetCode,
      from_name:"DGS Automate",
    };
    
    return emailjs.send('service_vdx73bk', 'template_21x2swq', templateParams)
      .then(response => {
        console.log('Email successfully sent!', response);
        return response;
      })
      .catch(err => {
        console.error('Failed to send email:', err);
        throw err;
      });
  }

  resetPassword(username: string, resetCode: string, newPassword: string): boolean {
    const users = this.userService.getUsers();
    const user = users.find(u => u.username === username);
    if (user && this.checkResetCode(user.email, resetCode)) {
      return this.userService.changePassword(username, newPassword);
    }
    return false;
  }
  
  checkResetCode(email: string, resetCode: string): boolean {
    const users = this.userService.getUsers();
    const user = users.find(u => u.email === email);
    if (user && user.resetCode === resetCode) {
      return true;
    }
    return false;
  }
}