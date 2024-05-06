import { Component } from '@angular/core';
import { AuthService } from '../Service/AuthService.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],  
  template: `
    <div>
      <button (click)="logout()">Logout</button>
    </div>
  `,
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private authService: AuthService) { }

  logout(): void {
    this.authService.logout();
    alert('Logged out');
  }
}