import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { MainModule } from './main/main.modul';
@NgModule({
  declarations: [
    AppComponent,
    RouterModule,
  ],
  imports: [
    CommonModule,
    MainModule
  ],
})
export class AppModule { } 