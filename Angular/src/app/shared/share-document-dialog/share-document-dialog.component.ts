import { Component, Inject } from '@angular/core';
import { ShareDocumentService } from '../../Service/shareDocument.service';
import { UserService } from '../../Service/user.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../Interface/User';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ShareRights } from '../../Interface/ShareRights';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from '../../app.module';
import { AppComponent } from '../../app.component';
@Component({
  selector: 'app-share-document',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatSelectModule,
    MatCheckboxModule,
    AppModule,
    TranslateModule,
  ],
  providers: [AppComponent], 
  templateUrl: `./share-document-dialog.component.html`,
  styleUrls: ['./share-document-dialog.component.scss']
})
export class ShareDocumentComponent {
  
  users: User[] = [];
  selectedUsers: number[] = [];
  selectedRights:ShareRights = { read: false, write: false,delete:false, share: false };
  removeUsers:boolean = false;
  sharedUsers: User[] = [];
  selectedSharedUser: number | null = null;

  constructor(
      public dialogRef: MatDialogRef<ShareDocumentComponent>,
      private shareDocumentService: ShareDocumentService,
      private userService: UserService,
      private translate: TranslateService,
      @Inject(MAT_DIALOG_DATA) public data: { documentId: number },
    ) {
    const storedLanguage = sessionStorage.getItem('selectedLanguage');
    const languageToUse = storedLanguage ? storedLanguage : 'lv';
    this.translate.use(languageToUse);
  
    const currentUserID = this.userService.getCurrentUser()?.userID;
    this.users = this.userService.getUsers().filter(user => user.userID !== currentUserID);
    const sharedUserIds = this.shareDocumentService.findSharedUsers(this.data.documentId);
    this.sharedUsers = this.users.filter(user => sharedUserIds.includes(user.userID));
  }
  
  onSharedUserChange(userId: number | null): void {
    if (userId) {
      const rights = this.shareDocumentService.getUserRights(userId, this.data.documentId);
      if (rights) {
        this.selectedRights = rights;
      }
      if (!this.selectedUsers.includes(userId)) {
        this.selectedUsers.push(userId);
      }
    } else {
      this.selectedRights = { read: false, write: false, delete: false, share: false };
      this.selectedUsers = [];
    }
  }

  shareDocument(): void {
    console.log('selectedRights',this.selectedRights);
    if(this.selectedUsers == null || this.selectedUsers.length == 0){
      alert('Please select at least one user to share the document');
      return;
    }
    if (this.removeUsers) {
      this.shareDocumentService.removeUsersFromSharing(this.data.documentId, this.selectedUsers);
    } else {
      this.shareDocumentService.shareDocument(this.data.documentId, this.selectedUsers, this.selectedRights);
    }
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}