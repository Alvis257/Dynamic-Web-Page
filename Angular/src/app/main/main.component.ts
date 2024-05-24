import { Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MainModule } from './main.modul';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { DataStructure } from '../Interface/DataStructure';
import { Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './CustomMatPaginatorIntl';
import { ApplicationDataService } from '../Service/aplicationData.service';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../Service/user.service';
import { StatusService } from '../Service/status.service';
import { ShareDocumentService } from '../Service/shareDocument.service';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';

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
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('startDateInput') startDateInput: MatStartDate<Date> | undefined;
  @ViewChild('endDateInput') endDateInput: MatEndDate<Date> | undefined;
  public rights = {
    admin: false,
    read: false,
    write: false,
    delete: false,
    share: false
  };

  displayedColumns: string[] = ['id', 'type', 'name', 'status', 'creationTime', 'responsible', 'options'];
  dataSource: MatTableDataSource<DataStructure> = new MatTableDataSource();
  statusList: string[] = [];
  selectedStatuses: string[] = [];
  endDate: Date | undefined;
  startDate: Date | undefined;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    public dialog: MatDialog,
    private applicationDataService: ApplicationDataService,
    private userService: UserService,
    private shareDocumentService: ShareDocumentService,
    private statusService: StatusService
  ) { }

  ngOnInit(): void {
    const rightsItem = this.userService.getCurrentUser()?.rights;
    if (rightsItem) {
      this.rights = rightsItem;
    }

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.statusService.getStatus().subscribe(data => {
      this.statusList = Object.keys(data.status);
    });

    this.dataSource.filterPredicate = (data: DataStructure, filter: string) => {
      const filterValues = JSON.parse(filter);
      const startDate = new Date(filterValues.startDate);
      const endDate = new Date(filterValues.endDate);
      const creationTime = new Date(data.creationTime);

      return filterValues.status.includes(data.status) && creationTime >= startDate && creationTime <= endDate;
    };
  }



  ngAfterViewInit() {
    // Use the service to get the data
    const data = this.applicationDataService.getAllApplications();
    this.dataSource = new MatTableDataSource(data);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  onStatusChange(status: string) {
    if (!status) {
      this.dataSource.data = this.applicationDataService.getAllApplications();
    } else {
      this.dataSource.data = this.applicationDataService.searchByStatus(status);
    }
  }

  onDateRangeChange(date: Date, type: string) {
    if (type === 'start') {
      this.startDate = date;
    } else {
      this.endDate = date;
    }
  
    if (this.startDate !== undefined && this.endDate !== undefined) {
      this.dataSource.data = this.applicationDataService.searchByCreationTime(this.startDate, this.endDate);
    }else if (this.startDate !== undefined) {
      this.dataSource.data = this.applicationDataService.searchByCreationTime(this.startDate, undefined);
    }
  }
  clearDateRange(startInput:any, endInput:any, event: Event) {
    event.stopPropagation();
    startInput.value = '';
    endInput.value = '';
    this.dataSource.data = this.applicationDataService.getAllApplications();
  }
  announceSortChange(sort: Sort) {
    this._liveAnnouncer.announce(`Sorted by ${sort.active} ${sort.direction}`);
  }

  applyFilter(filterValue: string) {
    const searchResults = this.applicationDataService.search(filterValue);
    this.dataSource.data = searchResults;
  }

  hasReadRights(id: number, Owner: string): boolean {
    const currentUserID = this.userService.getCurrentUser()?.userID;
    const UserName = this.userService.getCurrentUser()?.userName;
    const isOwner = Owner === UserName;
    if (!currentUserID) return false;

    const sharedRights = this.shareDocumentService.getUserRights(currentUserID, id);
    if (sharedRights == undefined) {
      return this.rights?.admin || this.rights?.read || isOwner;
    }

    return this.rights?.admin || sharedRights.read || this.rights?.read || isOwner;
  }

  hasDeleteRights(id: number, Owner: string): boolean {
    const currentUserID = this.userService.getCurrentUser()?.userID;
    const UserName = this.userService.getCurrentUser()?.userName;
    const isOwner = Owner === UserName;

    if (!currentUserID) return false;
    const sharedRights = this.shareDocumentService.getUserRights(currentUserID, id);
    if (sharedRights == undefined) {
      return this.rights?.admin || this.rights?.delete || isOwner;
    }
    return this.rights?.admin || sharedRights.delete || this.rights?.delete || isOwner;
  }
  view(element: any): void {
    const entry = this.applicationDataService.getApplicationById(element.id);
    console.log('element', element.type);
    console.log('Entry', entry);
    this.router.navigate(['/form-viewer', element.type], { queryParams: { type: element.type, jsonData: JSON.stringify(entry), id: element.id } });
  }
  delete(element: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.applicationDataService.deleteApplication(element.id);
        this.dataSource.data = this.applicationDataService.getAllApplications();
      }
    });
  }

}


