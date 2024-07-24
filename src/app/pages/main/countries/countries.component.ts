import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ExtendedD3GeoCountry } from '../../../services/main/types';
import { WorldService } from '../../../services/main/world.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss'
})
export class CountriesComponent implements OnInit {
  filteredCountries: ExtendedD3GeoCountry[] = []

  constructor(public worldService: WorldService) {}

  ngOnInit(): void {
    this.worldService.countries.subscribe((countries) => {
      this.filteredCountries = countries.filter(country => country.existsInCms)
    })
  }

  hover(country: any) {
    console.log('hovering on', country)
    this.worldService.highlightedCountry = country;
  }

  getLink(country: ExtendedD3GeoCountry) {
    const urlName = country.nameInCms?.toLowerCase().split(' ').join('-');
    return `/country/${urlName}`;
  }
}
