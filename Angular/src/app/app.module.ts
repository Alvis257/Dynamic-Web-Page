import { NgModule } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    AppComponent,
    MenuComponent,
    AppRoutingModule
  ],
})
export class AppModule { }