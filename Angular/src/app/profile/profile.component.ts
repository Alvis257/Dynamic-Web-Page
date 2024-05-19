import { Component, OnInit } from '@angular/core';
import { UserService } from '../Service/user.service';
import { ApplicationDataService } from '../Service/aplicationData.service';
import { ShareDocumentService } from '../Service/shareDocument.service';
import { User } from '../Interface/User';
import { Router } from '@angular/router';

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

  constructor(private userService: UserService, private applicationDataService: ApplicationDataService,private shareDocumentService:ShareDocumentService,private router: Router) { 
    this.documentCount = 0;
    this.sharedDocumentCount = 0;
  }

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    this.user.createdDate = this.user.createdDate.toString().slice(0, 19).replace('T', ' ');
    this.user.lastUpdatedDate = this.user.lastUpdatedDate.toString().slice(0, 19).replace('T', ' ');
    this.documentCount = this.applicationDataService.getApplications(this.user).length;
    this.sharedDocumentCount = this.shareDocumentService.findSharedDocuments(this.user.userID).length;
  }

  changePassword(): void {
    // Implement change password logic here
  }
}
