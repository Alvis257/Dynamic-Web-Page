import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../Interface/User';
import * as emailjs from 'emailjs-com';
import { Observable, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  languageChange: EventEmitter<string> = new EventEmitter();
  private apiUrl = 'http://localhost:5257/api/user';
  constructor(private http: HttpClient) {
    emailjs.init('LHO-vWp0D8DksFeYw');
  }

  login(userName: string, password: string): Promise<boolean> {
    return lastValueFrom(this.http.post<any>(`${this.apiUrl}/login`, { userName, password }))
      .then(user => {
        if (user) {
          sessionStorage.setItem('username', user.userName);
          sessionStorage.setItem('rights', JSON.stringify(user.rights));
          return true;
        } else {
          return false;
        }
      })
      .catch(() => false);
  }

  logout(): void {
    sessionStorage.removeItem('username');
    clearTimeout(Number(localStorage.getItem('sessionTimeoutId')));
  }

  checkIfUserExsists(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/getByEmail/${email}`);
  }

  async sendResetCode(email: string): Promise<{ resetCode: string; resetSent: boolean; } | null> {
    const user = await lastValueFrom(this.checkIfUserExsists(email));
    if (user) {
      const resetCode = Math.random().toString(36).substring(2, 15);
      const resetSent = await this.sendEmail(email, resetCode);
      if (resetSent) {
        const response = await lastValueFrom(this.http.post(`${this.apiUrl}/updateResetCode`, { userName: user.userName, resetCode: resetCode }, { observe: 'response' }));
        if (response && response.status === 200) {
          return { resetCode, resetSent };
        } else {
          console.error('Failed to update reset code');
        }
      }
    }
    return null;
  }

  sendEmail(to: string, resetCode: string): Promise<any> {
    const templateParams = {
      to_name: to,
      message: resetCode,
      from_name: "DGS Automate",
    };
    console.log(templateParams);
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

  async resetPassword(username: string, resetCode: string, newPassword: string): Promise<boolean> {
    const response = await lastValueFrom(this.http.post(`${this.apiUrl}/resetPassword`, { userName: username, resetCode: resetCode, newPassword: newPassword }, { observe: 'response' }));
    return response.status == 200 ? true : false;
  }

}