import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../Service/AuthService.service';
@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss' ],
  imports: [RouterModule]
})

export class MenuComponent {
  constructor(private router: Router, private route: ActivatedRoute,private authService: AuthService,) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}