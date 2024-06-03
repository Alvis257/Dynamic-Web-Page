import { Injectable } from '@angular/core';
import { User } from '../Interface/User';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5257/api/User';
  users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  constructor(private http: HttpClient) {
    if (this.users.length === 0) {
        if (this.users.length === 0) {
            this.users = [
              {
                userID:1,
                name: 'Simple User',
                surname: 'User',
                createdDate: new Date(),
                lastUpdatedDate: new Date(),
                userName: 'simple',
                password: 'password',
                role: 'user',
                email: 'simple@example.com',
                resetCode:'',
                rights: {
                  admin: false,
                  read: false,
                  write: false,
                  delete: false,
                  share: false
                }
              },
              {
                userID:2,
                userName: 'admin',
                name: 'Admin User',
                surname: 'User',
                createdDate: new Date(),
                lastUpdatedDate: new Date(),
                password: 'password',
                role: 'admin',
                email: 'pastarsalvis@gmail.com',
                resetCode:'',
                rights: {
                  admin: true,
                  read: true,
                  write: true,
                  delete: true,
                  share: true
                }
              }
            ];
            localStorage.setItem('users', JSON.stringify(this.users));
          }
    }
  }
  getUsers(): User[] {
    return this.users;
  }

  getCurrentUser(): User | null {
    const currentUsername = sessionStorage.getItem('username');
    if (currentUsername) {
      const user = this.users.find(u => u.userName === currentUsername);
      return user || null;
    }
    return null;
  }
  
  async addUser(user: User): Promise<void> {
    const maxUserId = Math.max(...this.users.map(u => u.userID), 0);
    user.userID = maxUserId + 1;
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));

    try {
      await lastValueFrom(this.http.post<User>(`${this.apiUrl}/user`, {
        name: user.name,
        surname: user.surname,
        userName: user.userName,
        password: user.password,
        role: user.role,
        email: user.email,
        rights: user.rights
      }));
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        console.error('Backend returned status code: ', error.status);
        console.error('Response body:', error.message);
      }
    }

  //   "name": "string",
  // "surname": "string",
  // "createdDate": "2024-06-02T19:00:42.425Z",
  // "lastUpdatedDate": "2024-06-02T19:00:42.425Z",
  // "userName": "string",
  // "password": "string",
  // "role": "string",
  // "email": "string",
  // "resetCode": "string",
  // "rights": {
  //   "admin": true,
  //   "read": true,
  //   "write": true,
  //   "delete": true,
  //   "share": true
  // }
  }

  updateUser(index: number, user: User): void {
    user.lastUpdatedDate = new Date();
    this.users[index] = user;
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  deleteUser(index: number): void {
    this.users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(this.users));
  }
  
  changePassword(username: string, newPassword: string): boolean {
    const user = this.users.find(u => u.userName === username);
    if (user) {
      user.password = newPassword;
      localStorage.setItem('users', JSON.stringify(this.users));
      return true;
    }
    return false; 
  }
}