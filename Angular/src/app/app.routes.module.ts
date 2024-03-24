import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankFormComponent } from './blank-form/blank-form.component';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
  { path: '', component: MainComponent, pathMatch: 'full' },
  { path: 'mani-dokumenti', component: BlankFormComponent },
  { path: 'visi-dokumenti', component: MainComponent },
  { path: 'datu-kopas', component: BlankFormComponent },
  { path: 'integrācijas', component: BlankFormComponent },
  { path: 'profils', component: BlankFormComponent }
]; 