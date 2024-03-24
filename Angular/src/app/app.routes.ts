import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BlankFormComponent } from './blank-form/blank-form.component';

export const routes: Routes = [
  { path: 'mani-dokumenti', component: BlankFormComponent },
  { path: 'visi-dokumenti', component: BlankFormComponent },
  { path: 'datu-kopas', component: BlankFormComponent },
  { path: 'integrācijas', component: BlankFormComponent },
  { path: 'profils', component: BlankFormComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule,RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

