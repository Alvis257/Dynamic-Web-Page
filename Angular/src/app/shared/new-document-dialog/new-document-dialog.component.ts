import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../Interface/User';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from '../../app.module';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-new-document-dialog',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    AppModule,
    TranslateModule,
  ],
  providers: [AppComponent], 
  templateUrl:'./new-document-dialog.component.html',
  styleUrls: ['./new-document-dialog.component.scss']
})
export class NewDocumentDialogComponent {
  name: string = '';
  responsible: string = '';
  type: string = '';
  types: any[];
  users: User[];

  constructor(
    public dialogRef: MatDialogRef<NewDocumentDialogComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { types: any[], users: User[] }
  ) {
    const storedLanguage = sessionStorage.getItem('selectedLanguage');
    const languageToUse = storedLanguage ? storedLanguage : 'lv';
    this.translate.use(languageToUse);

    this.types = data.types;
    this.users = data.users;
  }

  save(): void{
    console.log('name', this.name);
    console.log('type', this.type);
    console.log('responsible', this.responsible);
    this.dialogRef.close({ name: this.name, type: this.type, responsible: this.responsible });
  }

  close(): void{
    this.dialogRef.close();
  }
}
