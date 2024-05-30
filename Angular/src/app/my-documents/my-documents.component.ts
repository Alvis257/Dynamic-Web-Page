import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { ApplicationDataService } from '../Service/aplicationData.service';
import { DataStructure } from '../Interface/DataStructure';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './CustomMatPaginatorIntl';
import { UserService } from '../Service/user.service';
import { ShareDocumentService } from '../Service/shareDocument.service';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NewDocumentDialogComponent } from '../shared/new-document-dialog/new-document-dialog.component';
import { TypeService } from '../Service/type.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatDateRangePicker, MatDatepickerModule, MatEndDate, MatStartDate } from '@angular/material/datepicker';
import { ParameterService } from '../Service/parameter.service';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-my-documents',
  standalone: true,
  animations: [],
  imports: [
    CommonModule,
    FormsModule,
    MatSortModule,
    MatSelectModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginator,
    MatTableModule,
    MatIconModule,
    TranslateModule,
    MatDatepickerModule,
    MatDateRangePicker,
    ReactiveFormsModule,
    MatMomentDateModule,
  ],

  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.scss'],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl
    }
  ]
})
export class MyDocumentsComponent {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('startDateInput') startDateInput: MatStartDate<Date> | undefined;
  @ViewChild('endDateInput') endDateInput: MatEndDate<Date> | undefined;

  public rights!: {
    admin: boolean;
    read: boolean;
    write: boolean;
    delete: boolean;
    share: boolean;
  };

  displayedColumns: string[] = ['id', 'type', 'name', 'status', 'creationTime', 'responsible', 'options'];
  dataSource: MatTableDataSource<DataStructure> = new MatTableDataSource();
  selectedButton: 'myDocuments' | 'sharedWithMe' = 'myDocuments';
  statusList: string[] = [];
  selectedStatuses: string[] = [];
  startDate: Date | undefined;
  endDate: Date | undefined;


  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    public dialog: MatDialog,
    private typeService: TypeService,
    private applicationDataService: ApplicationDataService,
    private userService: UserService,
    private shareDocumentService: ShareDocumentService,
    private parameterService: ParameterService) {

    this.parameterService.getStatus().subscribe(data => {
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
    this.selectedButton = 'myDocuments';
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    const userApplications = this.applicationDataService.getApplications(currentUser);
    this.dataSource = new MatTableDataSource(userApplications);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  selectMyDocuments(): void {
    this.selectedButton = 'myDocuments';
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    const userApplications = this.applicationDataService.getApplications(currentUser);
    this.dataSource = new MatTableDataSource(userApplications);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  openNewDocumentDialog() {
    const types = this.typeService.getTypes();
    const users = this.userService.getUsers();
    console.log(types);
    const dialogRef = this.dialog.open(NewDocumentDialogComponent, {
      width: '500px',
      data: { types, users }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.applicationDataService.addApplication(result);
      }
    });
  }

  selectSharedWithMe(): void {
    this.selectedButton = 'sharedWithMe';
    const currentUser = this.userService.getCurrentUser();
    const sharedDocumentid = this.shareDocumentService.findSharedDocuments(currentUser?.userID || 0);
    const sharedDocuments = this.applicationDataService.getApplicationListById(sharedDocumentid);
    this.dataSource = new MatTableDataSource(sharedDocuments);
  }

  onStatusChange(status: string) {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.selectedButton === 'sharedWithMe') {
      if (!status) {
        const sharedDocumentid = this.shareDocumentService.findSharedDocuments(currentUser?.userID || 0);
        const sharedDocuments = this.applicationDataService.getApplicationListById(sharedDocumentid);
        this.dataSource = new MatTableDataSource(sharedDocuments);
      } else {
        this.dataSource.data = this.applicationDataService.searchSharedDocumentsByStatus(status, currentUser);
      }
    } else {
      if (!status) {
        this.dataSource.data = this.applicationDataService.getApplications(currentUser);
      } else {
        this.dataSource.data = this.applicationDataService.searchOwnedDocumentsByStatus(status, currentUser);
      }
    }
  }

  onDateRangeChange(date: Date, type: string) {
    if (type === 'start') {
      this.startDate = date;
    } else {
      this.endDate = date;
    }

    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.selectedButton === 'sharedWithMe') {
      if (this.startDate !== undefined && this.endDate !== undefined) {
        this.dataSource.data = this.applicationDataService.searchSharedDocumentsByCreationTime(this.startDate, this.endDate, currentUser);
      } else if (this.startDate !== undefined) {
        this.dataSource.data = this.applicationDataService.searchSharedDocumentsByCreationTime(this.startDate, undefined, currentUser);
      }
    } else {
      if (this.startDate !== undefined && this.endDate !== undefined) {
        this.dataSource.data = this.applicationDataService.searchOwnedDocumentsByCreationTime(this.startDate, undefined, currentUser);
      } else if (this.startDate !== undefined) {
        this.dataSource.data = this.applicationDataService.searchOwnedDocumentsByCreationTime(this.startDate, undefined, currentUser);
      }
    }
  }

  clearDateRange(startInput: any, endInput: any, event: Event) {
    event.stopPropagation();
    startInput.value = '';
    endInput.value = '';

    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.selectedButton === 'sharedWithMe') {
      const sharedDocumentid = this.shareDocumentService.findSharedDocuments(currentUser?.userID || 0);
      const sharedDocuments = this.applicationDataService.getApplicationListById(sharedDocumentid);
      this.dataSource = new MatTableDataSource(sharedDocuments);
    } else {
      this.dataSource.data = this.applicationDataService.getApplications(currentUser);
    }
  }

  applyFilter(filterValue: string) {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    let searchResults;
    if (this.selectedButton === 'myDocuments') {
      searchResults = this.applicationDataService.searchOwnedDocuments(filterValue, currentUser);
    } else if (this.selectedButton === 'sharedWithMe') {
      searchResults = this.applicationDataService.searchSharedDocuments(filterValue, currentUser);
    }
    if (searchResults !== undefined) {
      this.dataSource.data = searchResults;
    }
  }

  announceSortChange(sort: Sort) {
    this._liveAnnouncer.announce(`Sorted by ${sort.active} ${sort.direction}`);
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
    const jsonData = this.applicationDataService.getApplicationById(element.id);
    this.router.navigate(['/form-viewer', element.type], { queryParams: { type: element.type, jsonData: JSON.stringify(jsonData), id: element.id } });
  }
  delete(element: any): void {

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {


        this.applicationDataService.deleteApplication(element.id);
        if (this.selectedButton === 'myDocuments') {
          const currentUser = this.userService.getCurrentUser();
          if (!currentUser) {
            this.router.navigate(['/login']);
            return;
          }
          const userApplications = this.applicationDataService.getApplications(currentUser);
          this.dataSource = new MatTableDataSource(userApplications);
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }

          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
        } else {
          const currentUser = this.userService.getCurrentUser();
          const sharedDocumentid = this.shareDocumentService.findSharedDocuments(currentUser?.userID || 0);
          const sharedDocuments = this.applicationDataService.getApplicationListById(sharedDocumentid);
          this.dataSource = new MatTableDataSource(sharedDocuments);
        }
      }
    });

  }
}



