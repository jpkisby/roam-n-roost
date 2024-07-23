import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WorldService } from '../../../services/main/world.service';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss'
})
export class CountriesComponent {
  constructor(public worldService: WorldService) {}

  hover(country: any) {
    console.log('hovering on', country)
    this.worldService.highlightedCountry = country;
  }
}
