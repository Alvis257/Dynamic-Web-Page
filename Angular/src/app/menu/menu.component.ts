import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../Service/authService.service';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss' ],
  imports: [RouterModule,CommonModule,MatSelectModule,TranslateModule]
})

export class MenuComponent {
  public rights!: {
    admin: boolean;
    read: boolean;
    write: boolean;
    delete: boolean;
    share: boolean;
  };
  selectedLanguage = 'lv';


  constructor(private router: Router, private route: ActivatedRoute,private authService: AuthService,private translate: TranslateService) {
    const storedLanguage = sessionStorage.getItem('selectedLanguage');
    const languageToUse = storedLanguage ? storedLanguage : 'lv';
    this.selectedLanguage = languageToUse;
    this.translate.use(languageToUse);
  }

  ngOnInit(): void {
    const rightsItem = sessionStorage.getItem('rights');
    if (rightsItem !== null) {
      this.rights = JSON.parse(rightsItem);
    } else {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changeLanguage(language: string) {
    if (this.selectedLanguage !== language) {
      this.selectedLanguage = language;
      this.translate.use(language);
      sessionStorage.setItem('selectedLanguage', language); // store the selected language in the session storage
      this.authService.languageChange.emit(language);
    }
  }
}