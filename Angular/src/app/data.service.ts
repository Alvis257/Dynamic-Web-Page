import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  
  getJsonData(loadeOriginal:boolean): Observable<any> {
    const data = localStorage.getItem('formData');
    if (!data || loadeOriginal === true) {
      return this.http.get('http://localhost:4200/assets/form-data.json');
    }

    const formData = JSON.parse(data);
    return of(formData ? formData : []);
  }

  saveJsonData(data: any): void {
    localStorage.setItem('formData', JSON.stringify(data));
  }
}