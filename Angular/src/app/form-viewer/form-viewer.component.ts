import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { TypeService } from '../Service/type.service';
import { TranslateModule } from '@ngx-translate/core';
interface DataItem {
  formType: string;
  id:number;
  name: string;
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
  imports: [MatListModule, RouterModule, MatSidenavModule,CommonModule , TranslateModule],
  templateUrl: './form-viewer.component.html',
  styleUrls: ['./form-viewer.component.scss'],
  
})
export class FormViewerComponent implements OnInit {
  DataItem: DataItem[] = [];
  menuData: MenuNode[] = [];
  loadeOriginal = true;
  type: string | undefined;
  jsonData: any;
  hasLoadedFirstForm = false;

  constructor(
    private typeService: TypeService,
    private router: Router, 
    private route: ActivatedRoute,) { 
    }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'];
      this.jsonData = params['jsonData'] ? JSON.parse(params['jsonData']) : null;
      this.menuData = [];
      const storedFormId = localStorage.getItem('selectedFormId');

      if (this.type) {
        const types = this.typeService.getTypes();
        const data = types.filter(t => t.formType === this.type);
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (item.forms) {
              const forms = item.forms.map((form: any) => ({ name: form.name, id: form.formId }));
              this.menuData.push({ type: item.formType, forms });
            }
          });
        }
      }

      

      if (storedFormId) {
        this.loadFormById(Number(storedFormId));
      } else if (!this.hasLoadedFirstForm) {
        this.loadFormById(1);
        this.hasLoadedFirstForm = true;
      }

    });
  }
  onReload() {
    const storedFormId = localStorage.getItem('selectedFormId');
    if (storedFormId) {
      this.loadFormById(Number(storedFormId));
    }
  }
  view(form: Form): void {
    this.router.navigate([form.name], { 
      relativeTo: this.route, 
      queryParams: { 
        formData: JSON.stringify(form),
        formId: form.id,
        type: this.type,
        jsonData: JSON.stringify(this.jsonData)
      } 
    });

  }

  loadFormById(id: number): void {
    for (let node of this.menuData) {
      for (let form of node.forms) {
        if (form.id === id) {
          this.view(form);
          break;
        }
      }
    }
  }
}