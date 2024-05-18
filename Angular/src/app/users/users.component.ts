import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../Interface/User';
import { UserService } from '../Service/user.service';
import { UserFormComponent } from '../shared/user-dialog/user-dialog.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,UserFormComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.users = this.userService.getUsers();
  }

  openDialog(user?: User, index?: number): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      data: { user, index }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.index !== undefined) {
          this.userService.updateUser(result.index, result.user);
        } else {
          this.userService.addUser(result.user);
        }
      }
    });
  }

  deleteUser(index: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(index);
      }
    });
  }
}