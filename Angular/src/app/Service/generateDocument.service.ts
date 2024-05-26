import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class GenerateDocumentService {
private apiUrl = 'http://localhost:5257/api/Auth';
  constructor(private http: HttpClient) { }

    generateDocument(documentPath:string,documentType:string, jsonData:string): Promise<any> {
        return lastValueFrom(this.http.post<any>(`${this.apiUrl}/GenerateDocument`,{filePath:documentPath,type:documentType,data:jsonData}));
    }
}