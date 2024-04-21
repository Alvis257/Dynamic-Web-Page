import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'delete-confirmation-dialog',
  standalone: true,
  template: `
    <h1 mat-dialog-title>Delete Item</h1>
    <div mat-dialog-content>Are you sure you want to delete this item?</div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">No</button>
      <button mat-button cdkFocusInitial (click)="onYesClick()">Yes</button>
    </div>
  `,
  styleUrls: ['./delete-confirmation-dialog.component.scss' ],
})
export class DeleteConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}