import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service'; // replace with the path to your data service
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface DataItem {
  formType: string;
  id:number;
  name: string;
  // other properties...
}
interface Form {
  name: string;
  id: number;
}

interface MenuNode {
  type: string;
  forms: Form[];
}
@Component({
  selector: 'app-form-viewer',
  standalone: true,
  imports: [MatListModule, RouterModule, MatSidenavModule,CommonModule],
  templateUrl: './form-viewer.component.html',
  styleUrls: ['./form-viewer.component.scss']
})
export class FormViewerComponent implements OnInit {
  DataItem: DataItem[] = [];
  menuData: MenuNode[] = [];
  loadeOriginal = true;
  type: string | undefined;
  jsonData: any;
  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService,private http: HttpClient) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'];
      this.jsonData = params['jsonData'] ? JSON.parse(params['jsonData']) : null;
      console.log('Type:', this.type, 'JSON data:', this.jsonData);

      if (this.type) {
        this.http.get(`assets/${this.type}.json`).subscribe((data: any) => {
          console.log('Received type settings:', data);
          if (data.forms) {
            const forms = data.forms.map((form: any) => ({ name: form.name, id: form.formId }));
            this.menuData.push({ type: this.type || '', forms });
            console.log('Menu data:', this.menuData);
          }
        });
      }
    });
  }
  
  view(form: Form): void {
    console.log('Navigating to form:', form.name, 'with selected form data:', form);
    this.router.navigate([form.name], { relativeTo: this.route, queryParams: { formData: JSON.stringify(form) } });
  }
}