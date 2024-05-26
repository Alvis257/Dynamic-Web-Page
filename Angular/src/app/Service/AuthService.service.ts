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
    return this.http.get<any>(`${this.apiUrl}/getByEmail/${email}` );
  }

  async sendResetCode(email: string): Promise<{ resetSent: boolean; } | null> {
    console.info('Sending reset code to ' + email);
    const response = await lastValueFrom(this.http.post(`${this.apiUrl}/sendResetCode`, {email: email}, { observe: 'response' }));
    if (response && response.status === 200) {
        return { resetSent: true };
    } else {
        console.error('Failed to send reset code');
        return null;
    }
  }
  
  checkResetCode(email: string, resetCode: string): Promise<boolean> {
    return lastValueFrom(this.http.post<any>(`${this.apiUrl}/checkResetCode`, { email: email,resetCode: resetCode },{ observe: 'response' }))
      .then(response => response.status === 200 )
      .catch(() => false);
  }

  async resetPassword(username: string, resetCode: string, newPassword: string): Promise<boolean> {
    const response = await lastValueFrom(this.http.post(`${this.apiUrl}/resetPassword`, { userName: username, resetCode: resetCode, newPassword: newPassword }, { observe: 'response' }));
    return response.status == 200 ? true : false;
  }

}