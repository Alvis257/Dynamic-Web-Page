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
      <p class="field-config-text">Position: <input [(ngModel)]="data.position" type="number"></p>
      <p class="field-config-text" *ngIf="IsLabel()">Value: <input [(ngModel)]="data.value"></p>
      <p class="field-config-text">Style: <input [(ngModel)]="data.style"></p>
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
      this.data.type = this.convertToString(this.data.type);
      this.data.name = this.convertToString(this.data.name);
      this.data.dataPath = this.convertToString(this.data.dataPath);
      this.data.value = this.convertToString(this.data.value);
      this.data.style = this.convertToString(this.data.style, '');
      this.data.position = this.convertToNumber(this.data.position);
  }
  convertToString(value: any, defaultValue: string = ''): string {
    return typeof value === 'string' ? value : defaultValue;
  }
    
  convertToNumber(value: any, defaultValue: number = 0): number {
    return typeof value === 'number' ? value : defaultValue;
  } 
  IsLabel(): boolean { return this.data.type === 'label'; }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  onClickSave(): void {
    this.dialogRef.close(this.data);
  }

}