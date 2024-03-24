import { Component, NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  imports: [RouterModule],
})

export class MenuComponent {
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe(() => {
      if (this.router.url === '/mani-dokumenti') {
        console.log('BlankFormComponent for "mani-dokumenti" is active');
      }
    });
    this.router.events.subscribe(() => {
      if (this.router.url === '/visi-dokumenti') {
        console.log('BlankFormComponent for "visi-dokumenti" is active');
      }
    });
    this.router.events.subscribe(() => {
      if (this.router.url === '/datu-kopas') {
        console.log('BlankFormComponent for "datu-kopas" is active');
      }
    });
    this.router.events.subscribe(() => {
      if (this.router.url == '/integracijas') {
        console.log('BlankFormComponent for "integrācijas" is active');
      }
    });
    this.router.events.subscribe(() => {
      if (this.router.url === '/profils') {
        console.log('BlankFormComponent for "profils" is active');
      }
    });
  }
}