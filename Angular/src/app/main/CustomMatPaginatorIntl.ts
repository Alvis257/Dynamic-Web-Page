import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { AuthService } from '../Service/authService.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor(private authService: AuthService,private translate: TranslateService) {
    super();  
    const storedLanguage = sessionStorage.getItem('selectedLanguage');
    const languageToUse = storedLanguage ? storedLanguage : 'lv';
    this.translate.use(languageToUse);
    
    this.getAndInitTranslations(languageToUse);

    this.authService.languageChange.subscribe((languageToUse: string) => {
      this.getAndInitTranslations(languageToUse);
    });
  }

  getAndInitTranslations(languageToUse:string) {

    if(languageToUse === 'en') {
        this.itemsPerPageLabel = 'Items per page:';
        this.nextPageLabel = 'Next page';
        this.previousPageLabel = 'Previous page';
        this.firstPageLabel = 'First page';
        this.lastPageLabel = 'Last page';
    }else {
        this.itemsPerPageLabel = 'Rindas uz lapu:';
        this.nextPageLabel = 'Nākamā lapa';
        this.previousPageLabel = 'Iepriekšējā lapa';
        this.firstPageLabel = 'Pirmā lapa';
        this.lastPageLabel = 'Pēdējā lapa';
    }

    this.changes.next();
  }

 override getRangeLabel = (page: number, pageSize: number, length: number) =>  {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  }
}