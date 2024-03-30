import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [MenuComponent, RouterModule],
})
export class AppComponent {}
