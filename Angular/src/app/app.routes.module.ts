import { Routes } from '@angular/router';
import { BlankFormComponent } from './blank-form/blank-form.component';
import { MainComponent } from './main/main.component';
import { FormsComponent } from './forms/forms.component';
const routes: Routes = [
  { path: '', component: MainComponent, pathMatch: 'full' , title : 'Visi dokumenti'},
  { path: 'mani-dokumenti', component: BlankFormComponent },
  { path: 'visi-dokumenti', component: MainComponent },
  { path: 'formas', component: BlankFormComponent },
  { path: 'integracijas', component: BlankFormComponent },
  { path: 'profils', component: BlankFormComponent },
  { path: 'forms/:id', component: FormsComponent }
];

export default routes;