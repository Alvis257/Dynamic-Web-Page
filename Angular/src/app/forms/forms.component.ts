import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { FieldConfigDialogComponent } from '../shared/field-configuration-dialog/field-configuration-dialog.component';
import { ActivatedRoute } from '@angular/router';

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
  jsonData: any;
  viewJsonData: string = '';

  constructor(private dataService: DataService , public dialog: MatDialog,private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.jsonData = params['element'];
    });

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
    formDataArray.forEach((field: { type: string; name: string; }) => {
      if (field.type === 'button') return;
      const nameParts = field.name.split('.');
      const initialValue = nameParts.reduce((obj, part) => obj && obj[part] ? obj[part] : '', this.jsonData);
      group[field.name as string] = new FormControl(initialValue);
    });
  
    this.form = new FormGroup(group);

    if (this.form) {
      this.form.valueChanges.subscribe(values => {
        for (const name in values) {
          if (values.hasOwnProperty(name)) {
            const nameParts = name.split('.');
            nameParts.reduce((obj, part, index) => {
              if (index === nameParts.length - 1) {
                obj[part] = values[name];
              } else {
                obj[part] = obj[part] || {};
              }
              return obj[part];
            }, this.jsonData);
          }
        }
      });
    }
  }

  openJsonView(): void {
    const jsonObject = JSON.parse(this.jsonData);
    this.viewJsonData = JSON.stringify(jsonObject, null, 2); // The second and third parameters will format the JSON string with 2 spaces of indentation
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
      let data: { [key: string]: any } = {}; // Explicitly define the type of 'data' as '{}'
      if(field.type == 'label') {
        data = { name: field.name, type: field.type, value: field.value}
        
      }else{
        data = { name: field.name, type: field.type}
      }
      console.log('Field data:', data);
      const dialogRef = this.dialog.open(FieldConfigDialogComponent, {
        width: '500px',
        data: data
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          field.name = result.name;
          field.value = result.value;
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