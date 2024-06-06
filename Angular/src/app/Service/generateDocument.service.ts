import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class GenerateDocumentService {
private apiUrl = 'http://localhost:5257/api/Document';
  constructor(private http: HttpClient) { }

    generateDocument(documentPath:string,documentType:string, jsonData:string): Observable<Blob> {
        return this.http.post<Blob>(`${this.apiUrl}/GenerateDocument`, 
        { filePath: documentPath, type: documentType, data: jsonData }, 
        { responseType: 'blob' as 'json' }
      );
    }
}