import { Injectable } from '@angular/core';
import { User } from '../Interface/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  constructor() {
    if (this.users.length === 0) {
        if (this.users.length === 0) {
            this.users = [
              {
                userID:1,
                username: 'simple',
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
                username: 'admin',
                password: 'password',
                role: 'admin',
                email: 'admin@example.com',
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
      const user = this.users.find(u => u.username === currentUsername);
      return user || null;
    }
    return null;
  }
  
  getUserByEmail(email: string): User | null {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }
  addUser(user: User): void {
    const maxUserId = Math.max(...this.users.map(u => u.userID), 0);
    user.userID = maxUserId + 1;
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  updateUser(index: number, user: User): void {
    this.users[index] = user;
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  updateResetCode(username: string, resetCode: string): boolean {
    const user = this.users.find(u => u.username === username);
    if (user) {
      user.resetCode = resetCode;
      localStorage.setItem('users', JSON.stringify(this.users));
      return true;
    }
    return false;
  }

  deleteUser(index: number): void {
    this.users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(this.users));
  }
  
  changePassword(username: string, newPassword: string): boolean {
    const user = this.users.find(u => u.username === username);
    if (user) {
      user.password = newPassword;
      localStorage.setItem('users', JSON.stringify(this.users));
      return true;
    }
    return false;
  }
}