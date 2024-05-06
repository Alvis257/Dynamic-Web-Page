import { Component } from '@angular/core';
import { AuthService } from '../Service/AuthService.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule], // Add FormsModule to the imports array
  templateUrl: 'login.component.html', // Provide the correct string value for the templateUrl property
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.login(this.username, this.password).then(success => {
      if (success) {
        this.router.navigate(['']);
      } else {
        alert('Login failed');
      }
    });
  }

  forgotPassword(): void {
    this.authService.forgotPassword(this.username);
    this.router.navigate(['/forgot-password']);
  }
}