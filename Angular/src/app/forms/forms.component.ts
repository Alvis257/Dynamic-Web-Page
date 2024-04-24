import { ChangeDetectorRef,Input, Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { DataService } from '../Service/data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { FieldConfigDialogComponent } from '../shared/field-configuration-dialog/field-configuration-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { NewFieldDialogComponent } from '../shared/new-field-dialog/new-field-dialog.component';

@Component({
  selector: 'app-forms',
  standalone: true,
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, FormsModule],
  encapsulation: ViewEncapsulation.None
})
export class FormsComponent implements OnInit {
  fieldData: any;
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
  disableJsonView = true;
  fromSelector = false;
  formsId: number | undefined;
  @Output() configSaved = new EventEmitter<any>();
  
  constructor(private dataService: DataService, public dialog: MatDialog, private route: ActivatedRoute, private router: Router) { 
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      const typeObject = navigation.extras.state['type'];
      this.type = typeObject ? typeObject.formType : undefined;
      this.fieldData = navigation.extras.state['fieldData'];
      this.formsId = navigation.extras.state['id'];
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.jsonData = params['jsonData'] ? params['jsonData'] : null;
      this.configMode = params['configMode'] === 'true';
      this.fromSelector = params['fromSelector'];
    });
    console.log(this.jsonData);
    this.subscribeToFormChanges();
    if (this.fromSelector && this.fieldData) {
      this.disableJsonView = true;
      this.createFormFromFieldData();
      this.configMode = true;
    } else if (!this.fromSelector) {
      this.loadJsonData(this.jsonData);
      this.disableJsonView = false;
    }
  }
  
  loadJsonData(jsonData: any) {
    this.dataService.getJsonData(jsonData).subscribe(data => {
      this.formData = JSON.parse(data);
      this.processFormData();
      this.originalFormData = JSON.parse(data);
      this.createForm();
      if (this.form) {
        this.updateFormControlValues();
      }
    });
  
    if (!this.loadeOriginal) {
      this.dataService.getJsonData(this.loadeOriginal).subscribe(data => {
        this.formData = JSON.parse(data);
        this.processFormData();
        this.originalFormData = JSON.parse(data);
        this.createForm();
        if (this.form) {
          this.updateFormControlValues();
        }
      });
    } else {
      this.dataService.getJsonData(this.loadeOriginal).subscribe(data => {
        this.formData = JSON.parse(JSON.stringify(data));
        this.processFormData();
        this.originalFormData = JSON.parse(JSON.stringify(data));
        this.createForm();
        if (this.form) {
          this.updateFormControlValues();
        }
      });
    }
  }
  
  
  processFormData(): void {
    this.formData.forEach((field: { position: number | undefined; }, index: any) => {
      if (field.position === undefined || isNaN(field.position)) {
        field.position = index;
      }
    });
    this.formData.sort((a: { position: number; }, b: { position: number; }) => a.position - b.position);
  }

  createFormFromFieldData(): void {
    this.formData = this.ensureFormDataIsArray(this.fieldData);
    this.formData.forEach((field: { position: number | undefined; }, index: any) => {
      if (field.position === undefined || isNaN(field.position)) {
        field.position = index;
      }
    });
    this.formData.sort((a: { position: number; }, b: { position: number; }) => a.position - b.position);
    this.originalFormData = JSON.parse(JSON.stringify(this.fieldData));
    this.createForm();
    if (this.form) {
      this.updateFormControlValues();
    }
  }
  createForm(): void {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }
    const formDataArray = this.ensureFormDataIsArray(JSON.parse(JSON.stringify(this.formData)));
    formDataArray.forEach((field, index) => {
      if (field.position === undefined || isNaN(field.position)) {
        field.position = index;
      }

      if (field.type === 'label') {
        const initialValue = this.getInitialValue(field);
        field.value = initialValue; // Update the label value
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
      if (field.type !== 'button' && field.type !== 'savebutton'&& field.type !== 'cancelbutton') {
        const initialValue = this.getInitialValue(field);
        group[field.name] = new FormControl(initialValue);
        field.valueControl = new FormControl(initialValue);
      }
    });
    return group;
  }

  getInitialValue(field: any): string {
    const dataPath = field.dataPath ? field.dataPath : '';
    let fieldValue = field.value ? field.value : '';
    let displayValue = '';

    if (field.type === 'label') {
      displayValue = fieldValue.toString();
    } else if ((field.type !== 'button' && field.type !== 'savebutton'&& field.type !== 'cancelbutton') && this.jsonData && dataPath && !this.configMode) {
      let value = dataPath.split('.').reduce((obj: any, part: string) => obj && obj[part] !== undefined ? obj[part] : '', JSON.parse(this.jsonData));
      displayValue = value !== '' ? value : fieldValue;
    } else {
      displayValue = fieldValue;
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
    this.displayData = this.configMode ? this.formData : JSON.parse(JSON.stringify(this.formData));
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
        if (field.type !== 'button' && field.type !== 'savebutton'&& field.type !== 'cancelbutton') {
          const initialValue = this.getInitialValue(field);
          const control = this.form ? this.form.get(field.name) : undefined;
          if (control) {
            control.setValue(initialValue);
          }
        }
      });
    }
  }


  moveUp(index:number): void {
    if (index > 0) {
      this.formData[index].position--;
      this.formData[index - 1].position++;
      this.formData.sort((a: { position: number }, b: { position: number }) => a.position - b.position);
      this.displayData = JSON.parse(JSON.stringify(this.formData));
    }
  }

  moveDown(index:number): void {
    if (index < this.formData.length - 1) {
      this.formData[index].position++;
      this.formData[index + 1].position--;
      this.formData.sort((a: any, b: any) => a.position - b.position);
      this.displayData = JSON.parse(JSON.stringify(this.formData));
    }
  }
  styleToObject(style: string, type: string): { [key: string]: string } {


    const styleObject: { [key: string]: string } = {};
    const properties = style.split(';');
    const minSizePx = 165; // minimum size in pixels
    const minSizePercent = 15; // minimum size in percent
    if (type !== 'savebutton'&& type !== 'cancelbutton'&& type !== 'button') {
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
    this.configMode = true;
    this.originalFormData = JSON.parse(JSON.stringify(this.formData));
    this.displayData = JSON.parse(JSON.stringify(this.formData)); // Update displayData
  }


  saveConfig(): void {
    if (this.form) {
      Object.keys(this.form.controls).forEach(key => {
        if (this.form) {
          const control = this.form.get(key);
          if (control) {
            const field = this.formData.find((field: any) => field.name === key);
            if (field) {
              field.value = control.value;
            }
          } else {
            console.log('No control found for key:', key);
          }
        }
      });
    }
  
    // If jsonData is present, start the process of loading jsonData into the fields
    if (this.jsonData) {
      this.formData.forEach((field: any) => {
        if (field.dataPath) {
          let jsonDataObject = JSON.parse(this.jsonData);
          const value = field.dataPath.split('.').reduce((obj: any, part: string) => obj && obj[part] !== undefined ? obj[part] : '', jsonDataObject);
          if (value === '') {
            this.updateJsonData(field.dataPath, field.value, jsonDataObject, field.type);
            this.jsonData = JSON.stringify(jsonDataObject);
          }
        }
      });
    }
  
    this.configMode = this.fromSelector ? true : false;
    this.updateFormControlValues();
    //this.dataService.saveConfigData(JSON.stringify(this.formData));// Pass the formId to the saveConfigData method
    this.originalFormData = JSON.parse(JSON.stringify(this.formData));
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }
    if(this.fromSelector){
      this.router.navigate(['formas'], { state: { editedType: this.type, editedForm: {id:this.formsId,data:this.formData} } });
    }
    this.configSaved.emit(this.formData);
  }

  cancelConfig(): void {
    this.formData = this.originalFormData;
    this.configMode = false;
    this.displayData = JSON.parse(JSON.stringify(this.formData)); // Update displayData
    this.createForm();
  }

  openFieldConfig(field: any): void {
    const data = {
      name: field.name,
      type: field.type,
      dataPath: field.dataPath,
      position: field.position,
      style: field.style,
      value: field.type === 'label' ? field.value : '',
    };

    const dialogRef = this.dialog.open(FieldConfigDialogComponent, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const originalField = this.formData.find((f: any) => f.name === field.name);
        if (originalField) {
          Object.assign(originalField, result);
          if (this.form) {
            const control = this.form.get(originalField.name);
            if (control) {
              control.setValue(originalField.value);
            }
          }
        }
        this.displayData = JSON.parse(JSON.stringify(this.formData));
      }
    });

  }

  addField(): void {
    const dialogRef = this.dialog.open(NewFieldDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.position = this.formData.length;
        this.formData.push(result);
        this.displayData = JSON.parse(JSON.stringify(this.formData));
        this.createForm();
      }
    });
  }

  confirmDelete(index: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.formData.splice(index, 1);
        this.displayData = JSON.parse(JSON.stringify(this.formData));
      }
    });
  }

  onSubmit(): void {
    if (this.form) {

      // Create a copy of jsonData to avoid modifying the original
      let jsonDataObject = this.jsonData ? JSON.parse(JSON.stringify(JSON.parse(this.jsonData))) : {};

      // Update jsonDataObject based on the form input values
      Object.keys(this.form.controls).forEach(key => {
        if (this.form) {
          const control = this.form.get(key);
          if (control) {
            const field = this.formData.find((field: any) => field.name === key);
            if (field && field.dataPath) {
              this.updateJsonData(field.dataPath, control.value, jsonDataObject, field.type);
            }
          }
        }
      });

      // Save the updated jsonData
      this.jsonData = JSON.stringify(jsonDataObject);
      //this.dataService.saveJsonData(this.jsonData);
    }
  }

  onCancel():void{
    //Todo: Implement the onCancel method
  }
}