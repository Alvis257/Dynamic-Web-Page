import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { FieldConfigDialogComponent } from '../shared/field-configuration-dialog/field-configuration-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-forms',
  standalone: true,
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, FormsModule],
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
  displayData: any;
  formChangesSubscription: Subscription | undefined;
  
  constructor(private dataService: DataService, public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.jsonData = params['element'];
      this.configMode = params['configMode'] === 'true';
    });
    this.subscribeToFormChanges();
    if (!this.loadeOriginal) {
      this.dataService.getJsonData(this.loadeOriginal).subscribe(data => {
        this.originalFormData = JSON.parse(data);
        this.formData = JSON.parse(data);
        this.createForm();
        if (this.form) {
          this.updateFormControlValues();
        }
      });
    } else {
      this.dataService.getJsonData(this.loadeOriginal).subscribe(data => {
        this.originalFormData = JSON.parse(data);
        this.formData = JSON.parse(data);
        this.createForm();
        if (this.form) {
          this.updateFormControlValues();
        }
      });
    }
  }

  createForm(): void {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }
    let formDataCopy = JSON.parse(JSON.stringify(this.formData));
    const formDataArray = this.ensureFormDataIsArray(formDataCopy);
    formDataArray.forEach((field, index) => {
      if (field.position === undefined || isNaN(field.position)) {
        field.position = index;
      }
      if (field.type === 'label') {
        const initialValue = this.getInitialValue(field);
        field.value = initialValue; // Update the label value
      } else if (field.type !== 'button' && field.type !== 'label') {
        const initialValue = this.getInitialValue(field);
      }
    });
    formDataArray.sort((a, b) => a.position - b.position);
    const group = this.createFormGroup(formDataArray);
    this.form = new FormGroup(group);
  
    this.displayData = formDataArray; 
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
        field.valueControl = new FormControl(initialValue);
      }
    });
    return group;
  }

  getInitialValue(field: any): string {
    const dataPath = field.dataPath;
    let displayValue = field.value;
    if (this.jsonData && dataPath && !this.configMode) {
      let value = dataPath.split('.').reduce((obj: any, part: string) => obj && obj[part] !== undefined ? obj[part] : '', JSON.parse(this.jsonData));
      if (field.type == 'label' && typeof displayValue == 'string') {
        displayValue = displayValue.replace(/{value}/g, value !== '' ? value : ''); // Replace {value} in displayValue
      } else {
        console.log('Type:', field.type ); 
        displayValue = value !== '' ? value : displayValue;
      }
    } else if (this.configMode && field.type === 'label' && typeof displayValue === 'string') {
      displayValue = displayValue.replace(/{value}/g, '{value}');
    }
    return displayValue;
  }
  subscribeToFormChanges(): void {
    if (this.form) {
      this.formChangesSubscription = this.form.valueChanges.subscribe(values => {
        if (!this.configMode && this.jsonData) {
          let jsonDataObject = JSON.parse(this.jsonData);
          for (const name in values) {
            if (values.hasOwnProperty(name)) {
              const dataPath = this.formData.find((field: { name: string; }) => field.name === name)?.dataPath;
              if (dataPath && this.formData.find((field: { name: string; }) => field.name === name)?.type !== 'button') {
                const fieldType = this.formData.find((field: { name: string; }) => field.name === name)?.type;
                this.updateJsonData(dataPath, values[name], jsonDataObject, fieldType);
              }
            }
          }
          this.jsonData = JSON.stringify(jsonDataObject);
          this.updateDisplayData();
        }
      });
    }
  }

  updateDisplayData(): void {
    if (this.configMode) {
      this.displayData = this.formData;
    } else {
      this.displayData = JSON.parse(JSON.stringify(this.formData));
      Object.values(this.displayData).forEach((field: any) => {
        if (field.type === 'label' && typeof field.value === 'string' && field.value.includes('{value}')) {
          const dataPath = field.dataPath;
          if (this.jsonData && dataPath) {
            let value = dataPath.split('.').reduce((obj: any, part: string) => obj && obj[part] !== undefined ? obj[part] : '', JSON.parse(this.jsonData));
            const match = field.value.match(/{value}/);
            if (match) {
              field.value = field.value.replace(match[0], value !== '' ? value : '');
            }
          }
        }
      });
    }
  }

  updateJsonData(dataPath: string, value: any, jsonDataObject: any, fieldType: string): void {
    if (fieldType === 'label') {
      return;
    }

    dataPath.split('.').reduce((obj: any, part: string, index: number, parts: string[]) => {
      if (index === parts.length - 1) {
        obj[part] = value;
      } else {
        if (!obj[part]) {
          obj[part] = {};
        }
      }
      return obj[part];
    }, jsonDataObject);
  }

  updateFormControlValues(): void {
    if (this.form && this.formData) {
      this.formData.forEach((field: any) => {
        if (field.type !== 'button') {
          const initialValue = this.getInitialValue(field);
          const control = this.form ? this.form.get(field.name) : undefined;
          if (control) {
            control.setValue(initialValue);
          }
        }
      });
    }
  }


  moveUp(field: any): void {
    const index = this.formData.indexOf(field);
    if (index > 0) {
      this.formData[index].position--;
      this.formData[index - 1].position++;
      this.formData.sort((a: { position: number }, b: { position: number }) => a.position - b.position);
    }
  }

  moveDown(field: any): void {
    const index = this.formData.indexOf(field);
    if (index < this.formData.length - 1) {
      this.formData[index].position++;
      this.formData[index + 1].position--;
      this.formData.sort((a: any, b: any) => a.position - b.position);
    }
  }

  styleToObject(style: string, type: string): { [key: string]: string } {
    const styleObject: { [key: string]: string } = {};
    const properties = style.split(';');
    const minSizePx = 165; // minimum size in pixels
    const minSizePercent = 15; // minimum size in percent
    if (type != 'button') {
      if (!styleObject['width']) {
        styleObject['width'] = '100%';
      }
    }

    if (!style) {
      return styleObject;
    }

    for (const property of properties) {
      const [key, value] = property.split(':');
      if (key && value) {

        if ((key.trim() === 'width' || key.trim() === 'height')) {
          if (value.includes('px') && parseFloat(value) < minSizePx) {
            styleObject[key.trim()] = minSizePx + 'px';
          } else if (value.includes('%') && parseFloat(value) < minSizePercent) {
            styleObject[key.trim()] = minSizePercent + '%';
          }
        }

        if (key.trim().includes('color') || key.trim().includes('background')) {
          continue;
        }

        styleObject[key.trim()] = value.trim();
      }
    }

    return styleObject;
  }

  fieldStyleToObject(style: string): { [key: string]: string } {
    const styleObject: { [key: string]: string } = {};
    const properties = style.split(';');

    for (const property of properties) {
      const [key, value] = property.split(':');
      if (key && value) {
        if (key.trim() !== 'width' && key.trim() !== 'height') {
          styleObject[key.trim()] = value.trim();
        }
      }
    }

    return styleObject;
  }


  openJsonView(): void {
    const jsonObject = JSON.parse(this.jsonData);
    this.viewJsonData = JSON.stringify(jsonObject, null, 2);
  }
  openConfig(): void {
    this.originalFormData = JSON.parse(JSON.stringify(this.formData));
    this.formConfig = this.formData;
    this.configMode = true;
  }

  saveConfig(): void {
      // Check that this.form is defined
      if (this.form) {
        // Update formData with the current form values
        Object.keys(this.form.controls).forEach(key => {
          if (this.form) {
            const control = this.form.get(key);
            if (control) {
              const field = this.formData.find((field: any) => field.name === key);
              if (field) {
                field.value = control.value;
              }
            }
          }
        });
    
        this.dataService.saveJsonData(JSON.stringify(this.formData));
        this.updateFormControlValues();
        this.createForm();
        this.configMode = false;
       // this.formData = this.originalFormData; // Corrected line
      }
    }


  cancelConfig(): void {
    this.formData = this.originalFormData;
    this.configMode = false;
    this.createForm();
  }

  openFieldConfig(field: any): void {
    if (typeof field === 'object' && field !== null) {
      let data: { [key: string]: any } = {};
      if (field.type == 'label') {
        data = { name: field.name, type: field.type, dataPath: field.dataPath, value: this.configMode ? field.value : this.getInitialValue(field), position: field.position, style: field.style }
      } else {
        data = { name: field.name, type: field.type, dataPath: field.dataPath, position: field.position, style: field.style }
      }
      const dialogRef = this.dialog.open(FieldConfigDialogComponent, {
        width: '500px',
        data: data
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          field.name = result.name;
          field.dataPath = result.dataPath;
          field.position = result.position;
          field.style = result.style;
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
    this.subscribeToFormChanges();
    if (this.form) {
      console.log(this.form.value);
  
      // Update jsonData and perform other checks here
      this.formData.forEach((field: any) => {
        if (field.type !== 'button' && field.type !== 'label') {
          const dataPath = field.dataPath;
          if (!this.configMode && this.jsonData && dataPath) {
            let jsonDataObject = JSON.parse(this.jsonData);
            const value = dataPath.split('.').reduce((obj: any, part: string) => obj && obj[part] !== undefined ? obj[part] : '', jsonDataObject);
            if (value === '' && field.value) {
              this.updateJsonData(dataPath, field.value.split(':')[1] || '', jsonDataObject, field.type);
              this.jsonData = JSON.stringify(jsonDataObject);
            }
          }
        }
      });
  
      this.dataService.saveJsonData(JSON.stringify(this.formData));
      this.updateFormControlValues();
      this.configMode = false;
      this.originalFormData = JSON.parse(JSON.stringify(this.formData));
      if (this.formChangesSubscription) {
        this.formChangesSubscription.unsubscribe();
      }
    }
  }
}