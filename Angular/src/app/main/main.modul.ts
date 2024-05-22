import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MatSort,
    MatTableModule,
    MatPaginator,
    MatInputModule,
    TranslateModule,
    RouterModule
  ],

})
export class MainModule { }