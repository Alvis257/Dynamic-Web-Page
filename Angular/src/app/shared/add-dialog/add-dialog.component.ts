import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../app.component';
import { AppModule } from '../../app.module';

@Component({
  selector: 'app-add-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    CommonModule, 
    MatInputModule,
    FormsModule,
    MatDialogModule,
    AppModule,
    TranslateModule,
  ],
  providers: [AppComponent],
  template: `
  <h1 mat-dialog-title>Pievienot</h1>
  <div mat-dialog-content>
    <mat-form-field>
      <mat-label>Nosaukums</mat-label>
      <input matInput [(ngModel)]="name">
    </mat-form-field>
  </div>
  <div mat-dialog-actions class="dialog-actions">
    <button  class="cancel-button" mat-button (click)="onNoClick()">Atcelt</button>
    <button  class="save-button" mat-button [mat-dialog-close]="validateName()" cdkFocusInitial>Pievienot</button>
  </div>
  `,
  styleUrls: ['./add-dialog.component.scss']
})

export class AddDialogComponent {
  name: string | undefined;
  selectedLanguage: string;

  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<AddDialogComponent>) {
    const storedLanguage = sessionStorage.getItem('selectedLanguage');
    const languageToUse = storedLanguage ? storedLanguage : 'lv';
    this.selectedLanguage = languageToUse;
    this.translate.use(languageToUse);
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  validateName(): string {
    if (!this.name || /\d/.test(this.name)) {
      return '';
    }

    return this.name;
  }
}
