import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialogContent,MatDialogActions } from '@angular/material/dialog';
import { MatFormField,MatFormFieldControl,MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../Interface/User';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,MatDialogActions,MatDialogContent,MatFormField,MatLabel,MatInputModule,CommonModule],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})

export class UserFormComponent {
  userForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['', Validators.required],
    resetCode:[''],
    rights: this.fb.group({
      admin: false,
      read: false,
      write: false,
      delete: false,
      share: false
    })
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User; index: number }
  ) {
    if (data.user) {
      this.userForm.setValue(data.user);
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.dialogRef.close({ user: this.userForm.value, index: this.data.index });
    }
  }
}
