import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
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
  types: { name: string, formType: string, forms: any, showForms: boolean }[] = [];
  constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      const editedType = navigation.extras.state['editedType'];
      const editedForm = navigation.extras.state['editedForm'];
      this.loadTypes().then(() => {
        if (editedType && editedForm) {
          this.saveEditedForm(editedType, editedForm);
        }
      });
    }
  }
  async loadTypes() {
    const firstType = await this.http.get<{ name: string, formType: string, forms: any, showForms: boolean }[]>('assets/first-type.json').toPromise().catch(() => []) as { name: string, formType: string, forms: any, showForms: boolean }[];
    const secondType = await this.http.get<{ name: string, formType: string, forms: any, showForms: boolean }[]>('assets/second-type.json').toPromise().catch(() => []) as { name: string, formType: string, forms: any, showForms: boolean }[];
    this.types = [...firstType, ...secondType];
    localStorage.setItem('types', JSON.stringify(this.types));
  }

  ngOnInit() {
    this.types = JSON.parse(localStorage.getItem('types') || '[]');

    this.route.params.subscribe(params => {
      let formId = params['id'];
    });
  }

  saveEditedForm(editedType: string, editedForm: any) {
    const type = this.types.find(type => type.formType === editedType);
    if (type) {
      const formIndex = type.forms.findIndex((form: { formId: any; }) => form.formId === editedForm.id);
      if (formIndex !== -1) {
        type.forms[formIndex].fields = editedForm.data;
      }
    }
  }
  addType() {
    const dialogRef = this.dialog.open(AddDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.types.push({ name: result, formType: result, forms: [], showForms: false });
      }
    });
  }

  addForm(type: any) {
    const dialogRef = this.dialog.open(AddDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        type.forms.push({ name: result });
      }
    });
  }

  editForm(type: any, form: any) {
    this.router.navigate(['formas/forms'], { state: { type: type, fieldData: form.fields, id: form.formId }, queryParams: { fromSelector: 'true' } });
  }

  deleteForm(type: any, form: any) {
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

  editType(type: any) {
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

  deleteType(type: any) {
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

}
