import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss' ],
  imports: [RouterModule]
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
      if (this.router.url === '/formas') {
        console.log('BlankFormComponent for "formas" is active');
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