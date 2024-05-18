import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../Service/authService.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss' ],
  imports: [RouterModule,CommonModule]
})

export class MenuComponent {
  public rights!: {
    admin: boolean;
    read: boolean;
    write: boolean;
    delete: boolean;
    share: boolean;
  };
  constructor(private router: Router, private route: ActivatedRoute,private authService: AuthService) {}

  ngOnInit(): void {
    const rightsItem = sessionStorage.getItem('rights');
    if (rightsItem !== null) {
      this.rights = JSON.parse(rightsItem);
    }
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}