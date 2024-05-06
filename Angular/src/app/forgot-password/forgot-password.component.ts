import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../Service/AuthService.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})

export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  resetCode: string | null = null;
  isResetCodeVerified = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  sendResetCode(): void {
    const email = this.forgotPasswordForm.get('email')?.value;
   // this.resetCode = this.authService.sendResetCode(email);
  }

  resetPassword(): void {
    const code = this.forgotPasswordForm.get('code')?.value;
    const newPassword = this.forgotPasswordForm.get('newPassword')?.value;
    if (code === this.resetCode) {
      this.authService.resetPassword(newPassword);
    } else {
      console.error('Invalid reset code');
    }
  }

  verifyResetCode(): void {
    const code = this.forgotPasswordForm.get('code')?.value;
    if (code === this.resetCode) {
      this.isResetCodeVerified = true;
    } else {
      console.error('Invalid reset code');
    }
  }
}