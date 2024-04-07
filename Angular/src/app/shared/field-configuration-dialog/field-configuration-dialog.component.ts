import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-field-config-dialog',
  standalone: true,
  template: `
    <h1 mat-dialog-title>Field Configuration</h1>
    <div mat-dialog-content>
      <p class="field-config-text">Type: {{data.type}}</p>
      <p class="field-config-text">Name: <input [(ngModel)]="data.name"></p>
      <p class="field-config-text">Data Path: <input [(ngModel)]="data.dataPath"></p>
      <p  class="field-config-text" *ngIf="IsLabel()">Value: <input [(ngModel)]="data.value"></p>
    </div>
    <div mat-dialog-actions>
      <button class="save-button" mat-button (click)="onClickSave()">Save</button>
      <button class="cancel-button" mat-button (click)="onNoClick()">Close</button>
    </div>
  `,
  imports: [CommonModule,FormsModule],
  styleUrls: ['./field-configuration-dialog.component.scss' ],
})
export class FieldConfigDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<FieldConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
    ngOnInit() {
      if (typeof this.data.type !== 'string') {
        this.data.type = String(this.data.type);
      }
      if (typeof this.data.name !== 'string') {
        this.data.name = String(this.data.name);
      }
      if (typeof this.data.dataPath !== 'string') {
        this.data.dataPath = String(this.data.dataPath);
      }
      if (typeof this.data.value !== 'string') {
        this.data.value = String(this.data.value);
      }
    }
  IsLabel(): boolean { return this.data.type === 'label'; }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  onClickSave(): void {
    this.dialogRef.close(this.data);
  }

}