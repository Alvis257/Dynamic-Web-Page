import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MatSort,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginator,
    MatInputModule,
    RouterModule
  ],

})
export class MainModule { }