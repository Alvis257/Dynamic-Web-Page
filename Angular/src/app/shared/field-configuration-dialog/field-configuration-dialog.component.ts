import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../app.component';
import { AppModule } from '../../app.module';
@Component({
  selector: 'app-field-config-dialog',
  standalone: true,
  template: `
  <h1 mat-dialog-title>{{ 'fieldConfig.title' | translate }}</h1>
  <div mat-dialog-content>
    <p class="field-config-text">{{ 'fieldConfig.type' | translate }}: {{data.type}}</p>
    <p class="field-config-text">{{ 'fieldConfig.name' | translate }}: <input [(ngModel)]="data.name"></p>
    <p *ngIf="data.type === 'generateButton' || data.type === 'saveButton' || data.type === 'cancelButton'" class="field-config-text">{{ 'fieldConfig.label' | translate }}: <input [(ngModel)]="data.label"></p>
    <p *ngIf="data.type !== 'generateButton' || data.type === 'saveButton' || data.type === 'cancelButton'" class="field-config-text">{{ 'fieldConfig.dataPath' | translate }}: <input [(ngModel)]="data.dataPath"></p>
    <p *ngIf="data.type === 'generateButton'" class="field-config-text">{{ 'fieldConfig.filePath' | translate }}: <input [(ngModel)]="data.filePath"></p>
    <p class="field-config-text">{{ 'fieldConfig.position' | translate }}: <input [(ngModel)]="data.position" type="number"></p>
    <p class="field-config-text" *ngIf="IsLabel()">{{ 'fieldConfig.value' | translate }}: <input [(ngModel)]="data.value"></p>
    <p class="field-config-text">{{ 'fieldConfig.style' | translate }}: <input [(ngModel)]="data.style"></p>
  </div>
  <div mat-dialog-actions>
    <button class="cancel-button" mat-button (click)="onNoClick()">{{ 'fieldConfig.cancelButton' | translate }}</button>
    <button class="save-button" mat-button (click)="onClickSave()">{{ 'fieldConfig.saveButton' | translate }}</button>
  </div>
  `,
  imports: [
    CommonModule,
    FormsModule,
    AppModule,
    TranslateModule,
  ],
  providers: [AppComponent],
  styleUrls: ['./field-configuration-dialog.component.scss'],
})
export class FieldConfigDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<FieldConfigDialogComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    const storedLanguage = sessionStorage.getItem('selectedLanguage');
    const languageToUse = storedLanguage ? storedLanguage : 'lv';
    this.translate.use(languageToUse);

  }

  ngOnInit() {
    this.data.type = this.convertToString(this.data.type);
    this.data.name = this.convertToString(this.data.name);
    this.data.label = this.convertToString(this.data.label);
    this.data.dataPath = this.convertToString(this.data.dataPath);
    this.data.filePath = this.convertToString(this.data.filePath);
    this.data.value = this.convertToString(this.data.value);
    this.data.style = this.convertToString(this.data.style, '');
    this.data.position = this.convertToNumber(this.data.position);
  }

  convertToString(value: any, defaultValue: string = ''): string {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    return value.toString();
  }

  convertToNumber(value: any, defaultValue: number = 0): number {
    const numberValue = Number(value);
    return isNaN(numberValue) ? defaultValue : numberValue;
  }

  IsLabel(): boolean { return this.data.type === 'label'; }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClickSave(): void {
    this.dialogRef.close(this.data);
  }

}