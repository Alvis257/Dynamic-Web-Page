import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppModule } from './app.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
      ReactiveFormsModule,
      MatIconModule,
      FormsModule,
      MenuComponent,
      CommonModule,
      TranslateModule,
      RouterModule,
      AppModule
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [BrowserModule,BrowserAnimationsModule,TranslateService]
})

export class AppComponent {
  showMenu = true;

  constructor(private router: Router,private translate: TranslateService) {
    const storedLanguage = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('selectedLanguage') : null;
    const languageToUse = storedLanguage ? storedLanguage : 'lv';
    translate.setDefaultLang(languageToUse);
    this.translate.use(languageToUse);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showMenu = !event.urlAfterRedirects.includes('login') && !event.urlAfterRedirects.includes('forgot-password');
      }
    });

  }
}
