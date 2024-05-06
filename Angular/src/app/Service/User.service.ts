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
                username: 'simple',
                password: 'password',
                role: 'user',
                email: 'simple@example.com',
                rights: {
                  admin: false,
                  read: false,
                  write: false,
                  delete: false,
                  share: false
                }
              },
              {
                username: 'admin',
                password: 'password',
                role: 'admin',
                email: 'admin@example.com',
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

  addUser(user: User): void {
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  updateUser(index: number, user: User): void {
    this.users[index] = user;
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  deleteUser(index: number): void {
    this.users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(this.users));
  }
}