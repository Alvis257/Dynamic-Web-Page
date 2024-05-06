import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { Inject } from '@angular/core';
import { DataService } from './Service/data.service';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [MenuComponent, RouterModule, CommonModule, RouterModule],
})
export class AppComponent {
  showMenu = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showMenu = !event.urlAfterRedirects.includes('login') && !event.urlAfterRedirects.includes('forgot-password');
      }
    });
  }
}
