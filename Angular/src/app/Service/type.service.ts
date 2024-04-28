import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  constructor(private http: HttpClient) { }

  types: { name: string, formType: string, forms: any, showForms: boolean }[] = [];

  saveTypes(types: { name: string, formType: string, forms: any, showForms: boolean }[]) {
    localStorage.setItem('types', JSON.stringify(types));
  }
  saveType(type: { name: string, formType: string, forms: any, showForms: boolean }) {
    let types = this.getTypes();
    const index = types.findIndex(t => t.name === type.name);
    if (index !== -1) {
      types[index] = type;
    } else {
      types.push(type);
    }
    this.saveTypes(types);
  }

  addType(typeName: string) {
    let typeNames = JSON.parse(localStorage.getItem('typeNames') || '[]');
    typeNames.push(typeName);
    localStorage.setItem('typeNames', JSON.stringify(typeNames));
  }

  getTypes(): { name: string, formType: string, forms: any, showForms: boolean }[] {
    return JSON.parse(localStorage.getItem('types') || '[]');
  }
  getType(typeName: string): { name: string, formType: string, forms: any, showForms: boolean } | undefined {
    const types = this.getTypes();
    return types.find(t => t.formType === typeName);
  }
  deleteType(type: any) {
    let types = this.getTypes();
    const index = types.findIndex(t => t.name === type.name);
    if (index !== -1) {
      types.splice(index, 1);
      this.saveTypes(types);
    }
  }
}