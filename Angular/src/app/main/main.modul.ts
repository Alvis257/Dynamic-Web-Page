import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports: [
    MainComponent
  ]
})
export class MainModule { }