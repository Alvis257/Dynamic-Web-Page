import { Routes } from '@angular/router';
import { BlankFormComponent } from './blank-form/blank-form.component';
import { MainComponent } from './main/main.component';
import { FormsComponent } from './forms/forms.component';
import {FormSelectorComponent} from './form-selector/form-selector.component';
import { FormViewerComponent } from './form-viewer/form-viewer.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from './Service/AuthGuard.service';
import { UsersComponent } from './users/users.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {MyDocumentsComponent} from './my-documents/my-documents.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '', component: MainComponent, pathMatch: 'full' , title : 'Visi dokumenti', canActivate: [AuthGuard] },
  { path: 'mani-dokumenti', component: MyDocumentsComponent , canActivate: [AuthGuard] },
  { path: 'visi-dokumenti', component: MainComponent , canActivate: [AuthGuard] },
  { path: 'formas', component: FormSelectorComponent , canActivate: [AuthGuard] },
  { path: 'lietotaji', component: UsersComponent , canActivate: [AuthGuard] },
  { path: 'profils', component: BlankFormComponent , canActivate: [AuthGuard] },
  { path: 'forms', component: FormsComponent , canActivate: [AuthGuard] },
  { path: 'formas/forms', component: FormsComponent , canActivate: [AuthGuard] },
  { path: 'form-viewer', component: FormViewerComponent , canActivate: [AuthGuard] , children: [
    { path: ':type', component: FormsComponent , canActivate: [AuthGuard] }
  ] },
];

export default routes;