import { Component, OnInit } from '@angular/core';
import { CmsCountryService } from '../../services/country/cms-country.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Country } from '../../types/country.types';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent implements OnInit {
  country: Observable<Country> | undefined;

  constructor(public countryService: CmsCountryService) {}

  ngOnInit(): void {
    this.country = this.countryService.getCmsCountry('304');
  }
}
