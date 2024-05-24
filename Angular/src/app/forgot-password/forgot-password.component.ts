import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../Service/authService.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  resetCode: string | null = null;
  isResetCodeVerified = false;
  userExists = false;

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }
 // pastarsalvis@gmail.com
  async sendResetCode(): Promise<void> {
    const email = this.forgotPasswordForm.get('email')?.value;
    console.log(email);
    const reset = await this.authService.sendResetCode(email);
    console.log(reset);
    if (reset) {
      this.resetCode = reset.resetCode;
      this.userExists = true;
    } else {
      console.error('User not found');
      this.userExists = false;
    }
  }

  verifyResetCode(): void {
    const code = this.forgotPasswordForm.get('code')?.value;
    if (code === this.resetCode) {
      this.isResetCodeVerified = true;
    } else {
      console.error('Invalid reset code');
      this.isResetCodeVerified = false;
    }
  }

  resetPassword(): void {
    if (this.isResetCodeVerified) {
      const email = this.forgotPasswordForm.get('email')?.value;
      const code = this.forgotPasswordForm.get('code')?.value;
      const newPassword = this.forgotPasswordForm.get('newPassword')?.value;
  
      this.authService.checkIfUserExsists(email).subscribe(user => {
        if (user) {
          this.authService.resetPassword(user.userName, code, newPassword).then(passwordChanged => {
            if (passwordChanged) {
              console.log('Password changed successfully');
              this.router.navigate(['/login']); // Navigate to the login form
            } else {
              console.error('Failed to change password');
            }
          });
        } else {
          console.error('User not found');
        }
      });
    } else {
      console.error('Reset code not verified');
    }
  }
}