import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { Inject } from '@angular/core';
import { DataService } from './Service/data.service';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [MenuComponent, RouterModule],
})
export class AppComponent {}
