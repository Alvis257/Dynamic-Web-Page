import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from '../../app.module';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-edit-type-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    AppModule,
    TranslateModule,
  ],
  providers: [AppComponent],
  styleUrls: ['./edit-type-dialog.component.scss'],
  template: `
    <h1 mat-dialog-title>{{ 'editType.title' | translate }}</h1>
    <div mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field>
          <mat-label>{{ 'editType.name' | translate }}</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>
        <mat-form-field>
          <mat-label>{{ 'editType.typeName' | translate }}</mat-label>
          <input matInput formControlName="formType">
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button class="cancel-button" (click)="onCancel()">{{ 'editType.cancelButton' | translate }}</button>
      <button mat-button class="save-button" (click)="onSave()" [disabled]="form.invalid">{{ 'editType.saveButton' | translate }}</button>
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
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { name: string, formType: string }
  ) {
    
    const storedLanguage = sessionStorage.getItem('selectedLanguage');
    const languageToUse = storedLanguage ? storedLanguage : 'lv';
    this.translate.use(languageToUse);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}