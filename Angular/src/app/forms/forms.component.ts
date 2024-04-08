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
    const formDataArray = this.ensureFormDataIsArray(this.formData);
    const group = this.createFormGroup(formDataArray);
    this.form = new FormGroup(group);
    this.subscribeToFormChanges();
  }
  
  ensureFormDataIsArray(formData: any): any[] {
    return Array.isArray(formData) ? formData : [formData];
  }
  
  createFormGroup(formDataArray: any[]): { [key: string]: FormControl } {
    const group: { [key: string]: FormControl } = {}; 
    formDataArray.forEach(field => {
      if (field.type !== 'button') {
        const initialValue = this.getInitialValue(field);
        group[field.name] = new FormControl(initialValue);
        if (field.type === 'label') {
          field.value = initialValue;
        }
      }
    });
    return group;
  }
  
  getInitialValue(field: any): string {
    const dataPath = field.dataPath;
    if (this.jsonData && dataPath) {
      return dataPath.split('.').reduce((obj: any, part: string) => obj && obj[part] !== undefined ? obj[part] : '', JSON.parse(this.jsonData));
    }
    return '';
  }
  
  subscribeToFormChanges(): void {
    if (this.form) {
      this.form.valueChanges.subscribe(values => {
        if (this.jsonData) {
          let jsonDataObject = JSON.parse(this.jsonData);
          for (const name in values) {
            if (values.hasOwnProperty(name)) {
              const dataPath = this.formData.find((field: { name: string; }) => field.name === name)?.dataPath;
              if (dataPath && this.formData.find((field: { name: string; }) => field.name === name)?.type !== 'button') {
                this.updateJsonData(dataPath, values[name], jsonDataObject);
              }
            }
          }
          this.jsonData = JSON.stringify(jsonDataObject);
        }
      });
    }
  }
  
  updateJsonData(dataPath: string, value: any, jsonDataObject: any): void {
    dataPath.split('.').reduce((obj: any, part: string, index: number, parts: string[]) => {
      if (index === parts.length - 1) {
        obj[part] = value;
      } else {
        obj[part] = obj[part] || {};
      }
      return obj[part];
    }, jsonDataObject);
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
        data = { name: field.name, type: field.type, dataPath: field.dataPath ,  value: field.value}
        
      }else{
        data = { name: field.name, type: field.type , dataPath: field.dataPath}
      }
      console.log('Field data:', data);
      const dialogRef = this.dialog.open(FieldConfigDialogComponent, {
        width: '500px',
        data: data
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          field.name = result.name;
          field.dataPath = result.dataPath;
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