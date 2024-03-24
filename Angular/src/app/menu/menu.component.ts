import { Component, NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe(() => {
      if (this.router.url === '/mani-dokumenti') {
        console.log('BlankFormComponent for "mani-dokumenti" is active');
      }
      // Add similar checks for other routes...
    });
  }
}