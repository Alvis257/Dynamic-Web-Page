import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-dialog',
  standalone: true,
  imports: [MatFormFieldModule, CommonModule, MatInputModule,FormsModule,MatDialogModule],
  template: `<h1 mat-dialog-title>Add</h1>
  <div mat-dialog-content>
    <mat-form-field>
      <mat-label>Name</mat-label>
      <input matInput [(ngModel)]="name">
    </mat-form-field>
  </div>
  <div mat-dialog-actions class="dialog-actions">
    <button  class="cancel-button" mat-button (click)="onNoClick()">Cancel</button>
    <button  class="save-button" mat-button [mat-dialog-close]="validateName()" cdkFocusInitial>Add</button>
  </div>`,
  styleUrls: ['./add-dialog.component.scss']
})

export class AddDialogComponent {
  name: string | undefined;

  constructor(public dialogRef: MatDialogRef<AddDialogComponent>) {}
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  validateName(): string {
    // If the name is empty or contains numbers, return an empty string
    if (!this.name || /\d/.test(this.name)) {
      return '';
    }

    // Otherwise, return the name
    return this.name;
  }
}
