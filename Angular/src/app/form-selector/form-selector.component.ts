import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation} from '@angular/core';
import { Form, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from '../shared/add-dialog/add-dialog.component';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { EditTypeDialogComponent } from '../shared/edit-type-dialog/edit-type-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, FormsModule],
  templateUrl: './form-selector.component.html',
  styleUrls: ['./form-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})



export class FormSelectorComponent {
  
  selectedType: string | undefined;
  formsForType: Form[] | undefined;
  showForms = false;
  types: { name: string, forms: any, showForms: boolean }[] = [];
  constructor(private http: HttpClient, private route: ActivatedRoute,private dialog: MatDialog,private router: Router) {
    
  }

ngOnInit() {
  this.http.get<{ name: string, forms: any, showForms: boolean }[]>('assets/first-type.json').subscribe(data => {
    this.types = data;
  });
  this.http.get<{ name: string, forms: any, showForms: boolean }[]>('assets/second-type.json').subscribe(data => {
    this.types = [...this.types, ...data];
  });

  this.route.params.subscribe(params => {
    let formId = params['id'];
    this.loadForm(formId);
  });
}

addType() {
  const dialogRef = this.dialog.open(AddDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.types.push({ name: result, forms: [], showForms: false});
    }
  });
}

addForm(type:any) {
  const dialogRef = this.dialog.open(AddDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      type.forms.push({ name: result });
    }
  });
}

editForm(form: any, type: any) {
  this.router.navigate(['formas/forms'], { state: { fieldData: form.fields, type: type } });
}

deleteForm(type:any, form:any) {
  const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const index = type.forms.indexOf(form);
      if (index > -1) {
        type.forms.splice(index, 1);
      }
    }
  });
}

editType(type:any) {
  const dialogRef = this.dialog.open(EditTypeDialogComponent, {
    data: { name: type.name, formType: type.formType }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      type.name = result.name;
      type.formType = result.formType;
    }
  });
}

deleteType(type:any) {
  const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const index = this.types.indexOf(type);
      if (index > -1) {
        this.types.splice(index, 1);
      }
    }
  });
}
toggleForms(type: { name: string, forms: Form[], showForms: boolean }) {
  type.showForms = !type.showForms;
}


loadForm(id: string) {
  // Logic to load the form with the given ID
}
getFormsForType(type: string): Form[] {
  // Logic to get the forms for the selected type
  return []; // Placeholder return statement, replace with actual logic
}

}
