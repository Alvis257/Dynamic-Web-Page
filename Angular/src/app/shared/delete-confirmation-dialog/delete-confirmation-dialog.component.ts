import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../app.component';
import { AppModule } from '../../app.module';

@Component({
  selector: 'delete-confirmation-dialog',
  standalone: true,
  template: `
    <h1 mat-dialog-title>{{ 'deleteConfirmation.title' | translate }}</h1>
    <div mat-dialog-content>{{ 'deleteConfirmation.content' | translate }}</div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">{{ 'deleteConfirmation.noButton' | translate }}</button>
      <button mat-button cdkFocusInitial (click)="onYesClick()">{{ 'deleteConfirmation.yesButton' | translate }}</button>
    </div>
  `,
  imports: [
    AppModule,
    TranslateModule,
  ],
  providers: [AppComponent],
  styleUrls: ['./delete-confirmation-dialog.component.scss' ],
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    private translate: TranslateService,
  ) {
    const storedLanguage = sessionStorage.getItem('selectedLanguage');
    const languageToUse = storedLanguage ? storedLanguage : 'lv';
    this.translate.use(languageToUse);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}