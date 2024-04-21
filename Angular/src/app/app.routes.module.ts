import { Routes } from '@angular/router';
import { BlankFormComponent } from './blank-form/blank-form.component';
import { MainComponent } from './main/main.component';
import { FormsComponent } from './forms/forms.component';
import {FormSelectorComponent} from './form-selector/form-selector.component';
import { FormViewerComponent } from './form-viewer/form-viewer.component';
const routes: Routes = [
  { path: '', component: MainComponent, pathMatch: 'full' , title : 'Visi dokumenti'},
  { path: 'mani-dokumenti', component: BlankFormComponent },
  { path: 'visi-dokumenti', component: MainComponent },
  { path: 'formas', component: FormSelectorComponent },
  { path: 'integracijas', component: BlankFormComponent },
  { path: 'profils', component: BlankFormComponent },
  { path: 'forms', component: FormsComponent },
  { path: 'formas/forms', component: FormsComponent },
  { path: 'form-viewer', component: FormViewerComponent, children: [
    { path: ':type', component: FormsComponent }
  ] },
];

export default routes;