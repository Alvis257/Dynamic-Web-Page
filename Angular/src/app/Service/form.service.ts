import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TypeService } from './type.service';
import { Console } from 'console';

@Injectable({
  providedIn: 'root'
})
export class FormService {
    constructor(private http: HttpClient,private typeService: TypeService) { }
    
    getForm(type: string, formId: string): Observable<any> {
        // Assuming you have a types array in the service
        let Id = parseInt(formId);
        const types = this.typeService.getTypes();
        const correctType = types.find(t => t.formType === type);
        if (!correctType) {
            throw new Error(`Type ${type} does not exist`);
        }

        const correctForm = correctType.forms.find((form: { formId: number; }) => form.formId === Id);
        if (!correctForm) {
            throw new Error(`Form with ID ${formId} does not exist in type ${type}`);
        }

        // Return an observable of the form data
        return of(correctForm.fields);
    }

    addForm(typeName: string, formName: string) {
        const types = this.typeService.getTypes();
        const type = types.find(t => t.name === typeName);
        if (!type) {
            throw new Error(`Type ${typeName} does not exist`);
        }

        // Find the maximum formId in type.forms
        const maxFormId = Math.max(...type.forms.map((f: { formId: any; }) => f.formId), 0);

        // Create a new form with id = maxFormId + 1, name = formName, and an empty fields array
        const newForm = { formId: maxFormId + 1, name: formName, fields: [] };

        // Add the new form to type.forms
        type.forms.push(newForm);

        // Save the updated type
        this.typeService.saveType(type);
    }
    saveForm(typeName: string, form: any, types: { name: string, formType: string, forms: any, showForms: boolean }[]) {
        const typeIndex = types.findIndex(t => t.formType === typeName);
        if (typeIndex === -1) {
            throw new Error(`Type ${typeName} does not exist`);
        }
        
        const formIndex = types[typeIndex].forms.findIndex((f: { formId:number }) => f.formId === form.id);
        if (formIndex !== -1) {
            // If the form exists, replace it
            types[typeIndex].forms[formIndex].fields = form.data;
        } else {
            // If the form doesn't exist, add it
            types[typeIndex].forms.push(form);
        }
        
        // Set showForms to false for all types
        types.forEach(type => type.showForms = false);
        
        this.typeService.saveType(types[typeIndex]);
    }
    saveFormFields(typeName: string, formId: any, fields: any) {
        formId = parseInt(formId);
        const type = this.typeService.getType(typeName);
        if (!type) {
          throw new Error(`Type ${typeName} does not exist`);
        }
      
        const formIndex = type.forms.findIndex((f: { formId: number; }) => f.formId === formId);
        if (formIndex !== -1) {
          type.forms[formIndex].fields = fields;
          this.typeService.saveType(type);
        } else {
          throw new Error(`Form with ID ${formId} does not exist in type ${typeName}`);
        }
      }
    deleteForm(typeName: string, form: any) {
        const types = this.typeService.getTypes();
        const typeIndex = types.findIndex(t => t.name === typeName);
        if (typeIndex === -1) {
          throw new Error(`Type ${typeName} does not exist`);
        }
      
        const formIndex = types[typeIndex].forms.findIndex((f: { formId: number; }) => f.formId === form.formId);
        if (formIndex !== -1) {
          types[typeIndex].forms.splice(formIndex, 1);
          this.typeService.saveTypes(types);
        }
    }
}