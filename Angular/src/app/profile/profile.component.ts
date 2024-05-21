import { Component, OnInit } from '@angular/core';
import { UserService } from '../Service/user.service';
import { ApplicationDataService } from '../Service/aplicationData.service';
import { ShareDocumentService } from '../Service/shareDocument.service';
import { User } from '../Interface/User';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../shared/change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent  implements OnInit {
  user: User | null = null;
  documentCount: number;
  sharedDocumentCount: number;

  constructor(private userService: UserService,public dialog: MatDialog, private applicationDataService: ApplicationDataService,private shareDocumentService:ShareDocumentService,private router: Router) { 
    this.documentCount = 0;
    this.sharedDocumentCount = 0;
  }

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    this.user.createdDate = this.formatDate(this.user.createdDate);
    this.user.lastUpdatedDate = this.formatDate(this.user.lastUpdatedDate);
    this.documentCount = this.applicationDataService.getApplications(this.user).length;
    this.sharedDocumentCount = this.shareDocumentService.findSharedDocuments(this.user.userID).length;
  }
  formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hour = ('0' + d.getHours()).slice(-2);
    const mins = ('0' + d.getMinutes()).slice(-2);
    const secs = ('0' + d.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hour}:${mins}:${secs}`;
  }

  changePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent,{width: '600px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const username = this.userService.getCurrentUser()?.username;
        if (username) {
          this.changeUserPassword(username, result);
        }
      }
    });
  }

  changeUserPassword(username: string, newPassword: string): void {
    const result = this.userService.changePassword(username, newPassword);
    if (result) {
      console.log('Password changed successfully');
    } else {
      console.log('Failed to change password');
    }
  }
}
