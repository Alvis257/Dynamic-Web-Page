import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getJsonData(): Observable<any> {
    return this.http.get('http://localhost:4200/assets/form-data.json');
  }
}