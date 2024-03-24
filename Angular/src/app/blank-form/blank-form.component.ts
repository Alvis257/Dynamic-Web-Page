import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-blank-form',
  standalone: true,
  templateUrl: './blank-form.component.html',
  styleUrl: './blank-form.component.scss',
  imports: [RouterOutlet, MenuComponent]
})
export class BlankFormComponent {  }