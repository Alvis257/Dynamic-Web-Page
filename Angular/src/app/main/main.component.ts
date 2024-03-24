import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-main',
  standalone:true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [MatSort,MatTableModule]
})

export class MainComponent implements OnInit {
  displayedColumns: string[] = ['name', 'status', 'creationTime', 'responsible', 'options'];
  dataSource = new MatTableDataSource([
    { name: 'Item 1', status: 'Active', creationTime: '2022-01-01', responsible: 'John Doe', options: 'Option 1' },
    { name: 'Item 2', status: 'Inactive', creationTime: '2022-01-02', responsible: 'Jane Doe', options: 'Option 2' },
    { name: 'Item 3', status: 'Active', creationTime: '2022-01-03', responsible: 'John Smith', options: 'Option 3' },
    { name: 'Item 4', status: 'Inactive', creationTime: '2022-01-04', responsible: 'Jane Smith', options: 'Option 4' },
    { name: 'Item 5', status: 'Active', creationTime: '2022-01-05', responsible: 'John Johnson', options: 'Option 5' },
    { name: 'Item 6', status: 'Inactive', creationTime: '2022-01-06', responsible: 'Jane Johnson', options: 'Option 6' },
    { name: 'Item 7', status: 'Active', creationTime: '2022-01-07', responsible: 'John Williams', options: 'Option 7' },
    { name: 'Item 8', status: 'Inactive', creationTime: '2022-01-08', responsible: 'Jane Williams', options: 'Option 8' },
    { name: 'Item 9', status: 'Active', creationTime: '2022-01-09', responsible: 'John Brown', options: 'Option 9' },
    { name: 'Item 10', status: 'Inactive', creationTime: '2022-01-10', responsible: 'Jane Brown', options: 'Option 10' }
  ]);

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }

  ngOnInit(): void {
  }
}


