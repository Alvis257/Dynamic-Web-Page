import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { FieldConfigDialogComponent } from '../shared/field-configuration-dialog/field-configuration-dialog.component';

@Component({
  selector: 'app-forms',
  standalone: true,
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  imports: [ReactiveFormsModule,CommonModule,MatIconModule,FormsModule],
  encapsulation: ViewEncapsulation.None
})
export class FormsComponent implements OnInit {

  form: FormGroup | undefined;
  formData: any;
  originalFormData: any;
  type: string | undefined;
  loadeOriginal = false;
  configMode = false;
  formConfig: any;

  constructor(private dataService: DataService , public dialog: MatDialog) { }

  ngOnInit() {
    if (!this.loadeOriginal) {
      this.dataService.getJsonData(this.loadeOriginal).subscribe(data => {
        this.formData = JSON.parse(data);
        this.createForm();
      });
    }else{
      this.dataService.getJsonData(this.loadeOriginal).subscribe(data => {
        this.formData = data;
        this.createForm();
      });
    }
  
  }

  createForm(): void {
    const group: { [key: string]: FormControl } = {}; 

    const formDataArray = Array.isArray(this.formData) ? this.formData : [this.formData];
    formDataArray.forEach((field: { type: string; name: string | number; }) => {
      if (field.type === 'button') return;
      group[field.name as string] = new FormControl('');
    });
  
    this.form = new FormGroup(group);
  }

  openConfig(): void {
    this.originalFormData = JSON.parse(JSON.stringify(this.formData));
    this.formConfig = this.formData;
    this.configMode = true;
  }

  saveConfig(): void {
    this.dataService.saveJsonData(JSON.stringify(this.formData));
    this.configMode = false;
  }

  cancelConfig(): void {
    this.formData = this.originalFormData;
    this.createForm();
    this.configMode = false;
  }

  openFieldConfig(field: any): void {
    if (typeof field === 'object' && field !== null) {
      // Check if the name exists in the JSON data at the first level
      if (!this.formData.hasOwnProperty(field.name)) {
        // If it doesn't exist, add it
        this.formData[field.name] = '';
      }
  
      const dialogRef = this.dialog.open(FieldConfigDialogComponent, {
        width: '500px',
        data: { name: field.name, value: this.formData[field.name] }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result) {
          // Update the JSON data with the new value from the dialog
          this.formData[result.name] = result.value;
        }
      });
    } else {
      console.error('Cannot open field configuration dialog because field is not an object:', field);
    }
  }

  confirmDelete(index: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.formData.splice(index, 1);
      }
    });
  }

  onSubmit(): void {
    if (this.form) {
      console.log(this.form.value);
    }
  }
}