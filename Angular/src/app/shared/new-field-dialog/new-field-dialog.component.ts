import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../app.component';
import { AppModule } from '../../app.module';


@Component({
  selector: 'app-new-field-dialog',
  standalone: true,
  templateUrl: './new-field-dialog.component.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    AppModule,
    TranslateModule,
  ],
  providers: [AppComponent],
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


  constructor(public dialogRef: MatDialogRef<NewFieldDialogComponent>, private translate: TranslateService) { 
    const storedLanguage = sessionStorage.getItem('selectedLanguage');
    const languageToUse = storedLanguage ? storedLanguage : 'lv';
    this.translate.use(languageToUse);
  }

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
      position: -1,
    };

    this.dialogRef.close(data);

  }
}