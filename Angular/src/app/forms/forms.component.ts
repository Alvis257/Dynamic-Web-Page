import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-forms',
  standalone: true,
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  imports: [ReactiveFormsModule,CommonModule],
  encapsulation: ViewEncapsulation.None
})
export class FormsComponent implements OnInit {

  form: FormGroup | undefined;
  formData: any;
  type: string | undefined;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getJsonData().subscribe(data => {
      this.formData = data;
      this.createForm();
    });
  }

  createForm(): void {
    const group: { [key: string]: FormControl } = {}; 

    this.formData.forEach((field: { type: string; name: string | number; }) => {
      if (field.type === 'button') return;
      group[field.name as string] = new FormControl('');
    });

    this.form = new FormGroup(group);
  }

  onSubmit(): void {
    if (this.form) {
      console.log(this.form.value);
    }
  }
}