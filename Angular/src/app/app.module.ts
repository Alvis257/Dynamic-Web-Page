import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { BlankFormComponent } from './blank-form/blank-form.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RouterModule
  ]
})
export class AppModule { }