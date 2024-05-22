import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from '../../app.module';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,    
    AppModule,
    TranslateModule,
  ],
  providers: [AppComponent],
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent {
  password = '';
  errorMessage = '';
  hidePassword = true;
  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>) {
    const storedLanguage = sessionStorage.getItem('selectedLanguage');
    const languageToUse = storedLanguage ? storedLanguage : 'lv';
    this.translate.use(languageToUse);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.password);
  }

  validatePassword(): void {
    if (!this.isValidPassword(this.password)) {
      this.errorMessage = 'Invalid password. It must contain at least one uppercase letter, two digits, and one special character.';
    } else {
      this.errorMessage = '';
    }
  }

  isValidPassword(password: string): boolean {
    // At least one uppercase letter
    const hasUppercase = /[A-Z]/.test(password);

    // At least two digits
    const hasTwoDigits = /\d.*\d/.test(password);

    // At least one special character
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

    // At least 6 characters long
    const hasValidLength = password.length >= 6;

    return hasUppercase && hasTwoDigits && hasSpecialChar && hasValidLength;
}
}
