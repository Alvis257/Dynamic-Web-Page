import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { MainModule } from './main/main.modul';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    AppComponent,
    MainModule,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    MenuComponent
  ]
})
export class AppModule { }