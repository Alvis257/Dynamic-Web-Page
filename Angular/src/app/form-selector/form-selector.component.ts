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
import { TypeService } from '../Service/type.service';
import { FormService } from '../Service/form.service';
import { DataService } from '../Service/data.service';
import { forkJoin } from 'rxjs';
import { Console } from 'console';

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
  showForms:boolean = false;
  loadOriginal: boolean = false;
  types: { name: string, formType: string, forms: any, showForms: boolean }[] = [];
  constructor(private http: HttpClient,private dataService: DataService,private typeService: TypeService, private formService: FormService, private route: ActivatedRoute, private dialog: MatDialog, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    console.log('navigation', navigation);
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
    const typeNames = this.dataService.getTypeNames(this.loadOriginal);
    if (this.loadOriginal) {
      const typesObservables = this.dataService.getTypes(typeNames);
      const types = await forkJoin(typesObservables).toPromise().catch(() => []);
      this.types = [].concat(...types || []);
      this.typeService.saveTypes(this.types);
    } else {
      this.types = this.typeService.getTypes();
    }
  }

  ngOnInit() {
    this.loadTypes().then(() => {
      this.route.params.subscribe(params => {
        let formId = params['id'];
      });
    });
  }

  saveEditedForm(editedType: string, editedForm: any) {
    console.log('saving edited form');
    this.formService.saveForm(editedType, editedForm, this.types);
  }
  addType() {
    const dialogRef = this.dialog.open(AddDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newType = { name: result, formType: result, forms: [], showForms: false };
        this.types.push(newType);
        this.typeService.saveType(newType);
        this.typeService.addType(result);
      }
    });
  }

  addForm(type: any) {
    const dialogRef = this.dialog.open(AddDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newForm = { name: result };
        type.forms.push(newForm);
        this.formService.addForm(type.name, newForm.name);
      }
    });
  }

  editForm(type: any, form: any) {
    this.router.navigate(['formas/forms'], { state: { type: type, fieldData: form.fields, id: form.formId ,formName:form.name,fromSelector:true,configMode:true}, queryParams: { fromSelector: 'true' } });
  }

  deleteForm(type: any, form: any) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = type.forms.indexOf(form);
        if (index > -1) {
          type.forms.splice(index, 1);
          this.formService.deleteForm(type.name, form);
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
        this.typeService.saveType(type);
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
          this.typeService.deleteType(type);
        }
      }
    });
  }
  

  toggleForms(type: { name: string, forms: Form[], showForms: boolean }) {
    type.showForms = !type.showForms;
  }

}
