import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-type-dialog',
  standalone: true,
  imports: [MatFormFieldModule, CommonModule, MatInputModule,FormsModule,MatDialogModule,ReactiveFormsModule],
  styleUrls: ['./edit-type-dialog.component.scss'],
  template: `
    <h1 mat-dialog-title>Edit Type</h1>
    <div mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Type</mat-label>
          <input matInput formControlName="formType">
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button class="cancel-button" (click)="onCancel()">Cancel</button>
      <button mat-button class="save-button" (click)="onSave()" [disabled]="form.invalid">Save</button>
    </div>
  `,

})
export class EditTypeDialogComponent {
  form = this.fb.group({
    name: [this.data.name, Validators.required],
    formType: [this.data.formType, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string, formType: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}