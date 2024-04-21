import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-field-dialog',
  standalone: true,
  template: `
  <h1 mat-dialog-title>Add new field</h1>
  <div mat-dialog-content>
    <mat-form-field>
      <mat-label>Type</mat-label>
      <mat-select class="mat-select" [(ngModel)]="type">
          <mat-option *ngFor="let type of types" [value]="type.value">{{type.label}}</mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field *ngIf="type === 'saveButton' || type === 'cancelButton'">
      <mat-label>Button Label</mat-label>
      <input matInput [(ngModel)]="label">
    </mat-form-field>
    <mat-form-field>
      <mat-label>Name</mat-label>
      <input matInput [(ngModel)]="name">
    </mat-form-field>
    <mat-form-field>
      <mat-label>Data Path</mat-label>
      <input matInput [(ngModel)]="dataPath">
    </mat-form-field>
    <mat-form-field>
      <mat-label>Style</mat-label>
      <input matInput [(ngModel)]="style">
    </mat-form-field>
    <mat-form-field *ngIf="type === 'label'">
      <mat-label>Value</mat-label>
      <input matInput [(ngModel)]="value">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onCancel()">Cancel</button>
    <button mat-button (click)="onAdd()">Add</button>
  </div>
`,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, MatDialogModule, MatInputModule],
  styleUrls: ['./new-field-dialog.component.scss']

})

export class NewFieldDialogComponent {
  types = [
    { value: 'saveButton', label: 'Save Button' },
    { value: 'cancelButton', label: 'Cancel Button' },
    { value: 'label', label: 'Label' },
    { value: 'label_dynamic', label: 'Dynamic Label' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'text', label: 'Input' },
    // add more types here
  ];
  type = '';
  name = '';
  dataPath = '';
  style = '';
  value = '';
  label = '';

  constructor(public dialogRef: MatDialogRef<NewFieldDialogComponent>) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    const data = {
      type: this.type,
      name: this.name,
      dataPath: this.dataPath,
      style: this.style,
      value: this.value,
      label: this.label,
      position: -1, // Will be set to the last position in formData
    };

    this.dialogRef.close(data);

  }
}