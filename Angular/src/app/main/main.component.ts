import { Component, ViewChild } from '@angular/core';
import { MatSort ,Sort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MainModule } from './main.modul';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { DataStructure } from '../Interface/DataStructure';
import { Router } from '@angular/router'; 
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './CustomMatPaginatorIntl';

const ELEMENT_DATA: DataStructure[] = [
  { id: 1, name: 'Item 1', status: 'Active', creationTime: new Date('2022-01-01'), responsible: 'John Doe', type: 'first-form'},
  { id: 2, name: 'Item 2', status: 'Inactive', creationTime: new Date('2022-01-02'), responsible: 'Jane Doe', type: 'second-form'},
  { id: 3, name: 'Item 3', status: 'Active', creationTime: new Date('2022-01-03'), responsible: 'John Smith', type: 'first-form'},
  { id: 4, name: 'Item 4', status: 'Inactive', creationTime: new Date('2022-01-04'), responsible: 'Jane Smith', type: 'second-form'},
  { id: 5, name: 'Item 5', status: 'Active', creationTime: new Date('2022-01-05'), responsible: 'John Johnson', type: 'first-form'},
  { id: 6, name: 'Item 6', status: 'Inactive', creationTime: new Date('2022-01-06'), responsible: 'Jane Johnson', type: 'second-form'},
  { id: 7, name: 'Item 7', status: 'Active', creationTime: new Date('2022-01-07'), responsible: 'John Williams', type: 'first-form' },
  { id: 8, name: 'Item 8', status: 'Inactive', creationTime: new Date('2022-01-08'), responsible: 'Jane Williams', type: 'second-form' },
  { id: 9, name: 'Item 9', status: 'Active', creationTime: new Date('2022-01-09'), responsible: 'John Brown', type: 'first-form'},
  { id: 10, name: 'Item 10', status: 'Inactive', creationTime: new Date('2022-01-10'), responsible: 'Jane Brown', type: 'second-form' }
];


@Component({
  selector: 'app-main',
  standalone: false,
  animations: [],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [
    MainModule,
    {
    provide: MatPaginatorIntl,
    useClass: CustomMatPaginatorIntl
    }
  ]
})

export class MainComponent {
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild('paginator')
  paginator!: MatPaginator;
  
  displayedColumns: string[] = ['id','name', 'status', 'creationTime', 'responsible', 'options'];
  constructor( private _liveAnnouncer: LiveAnnouncer, private router: Router) { } 
  dataSource : MatTableDataSource<DataStructure> = new MatTableDataSource();
  
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    if(this.paginator) {
    this.dataSource.paginator = this.paginator ;
    }

    if(this.sort) {
      this.dataSource.sort = this.sort;
    } 
  }

  announceSortChange(sortState:Sort) {
    if(sortState.direction) {
      this._liveAnnouncer.announce('sorted ${sortState.direction}ending' );
    }else {
      this._liveAnnouncer.announce('sorting cleared');
    }
  }

  view(element: any): void {
    this.router.navigate(['/forms', element.id],{ queryParams: { type: element.type } });
  }

  delete(element: any): void {
    console.log('Delete:', element);
    // Add your delete logic here
  }

}


