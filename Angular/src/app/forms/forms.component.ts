import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-forms',
  standalone: true,
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {
  form: FormGroup | undefined;
  formData: any;
  type: string | undefined;

  constructor(private http: HttpClient) { }

  getFormData(): Observable<any> {
    let jsonFilePath = '';
    if (this.type === 'first-form') {
      jsonFilePath = 'app/forms/form-data.json';
    } else if (this.type === 'second-form') {
      jsonFilePath = 'app/forms/form-data.json';
    }
    return this.http.get(jsonFilePath);
  }

  ngOnInit(): void {
    this.getFormData().subscribe(data => {
      this.formData = data;
      this.createForm();
    });
  }

  createForm(): void {
    const group: { [key: string]: FormControl } = {}; // Add index signature to allow indexing with a string

    this.formData.forEach((field: { type: string; name: string | number; }) => {
      if (field.type === 'button') return;
      group[field.name as string] = new FormControl(''); // Cast field.name to string
    });

    this.form = new FormGroup(group);
  }

  onSubmit(): void {
    if (this.form) {
      console.log(this.form.value);
    }
  }
}