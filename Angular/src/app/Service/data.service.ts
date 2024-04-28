import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getTypeNames(loadOriginal:boolean): string[] {
    if (loadOriginal) {
      localStorage.removeItem('typeNames');
      localStorage.removeItem('types');
    }
    return JSON.parse(localStorage.getItem('typeNames') || '["first-type", "second-type"]');
  }

  getTypes(typeNames: string[]): Observable<any>[] {
    return typeNames.map(typeName => 
      this.http.get(`assets/${typeName}.json`).pipe(
        catchError(error => {
          console.error('Error loading type:', typeName, error);
          return of([]);
        })
      )
    );
  }

  saveConfigData(data: any): void {
    localStorage.setItem('formData', JSON.stringify(data));
  }

  saveConfigDataType(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
}