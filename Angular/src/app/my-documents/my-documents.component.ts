import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './CustomMatPaginatorIntl';
import { UserService } from '../Service/user.service';
import { ShareDocumentService } from '../Service/shareDocument.service';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NewDocumentDialogComponent } from '../shared/new-document-dialog/new-document-dialog.component';
import { TypeService } from '../Service/type.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-documents',
  standalone: true,
  animations: [],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatPaginator, 
    MatTableModule, 
    MatIconModule,
    TranslateModule
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
  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild('paginator')
  paginator!: MatPaginator;

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

  constructor(private _liveAnnouncer: LiveAnnouncer, private router: Router, public dialog: MatDialog, private typeService: TypeService, private applicationDataService: ApplicationDataService, private userService: UserService, private shareDocumentService: ShareDocumentService) { }

  ngAfterViewInit() {
    // Use the service to get the data
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

  announceSortChange(event: any) {
    const sortState = event as Sort;
    if (sortState.direction) {
      this._liveAnnouncer.announce(`sorted ${sortState.direction} ending`);
      this.dataSource.sort = this.sort;
    } else {
      this._liveAnnouncer.announce('sorting cleared');
      this.dataSource.sort = null;
    }
  }

  hasReadRights(id: number, Owner: string): boolean {
    const currentUserID = this.userService.getCurrentUser()?.userID;
    const UserName = this.userService.getCurrentUser()?.username;
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
    const UserName = this.userService.getCurrentUser()?.username;
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



