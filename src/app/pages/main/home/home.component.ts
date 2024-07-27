import { Component, OnInit } from '@angular/core';
import { WorldComponent } from '../world/world.component';
import { CountriesComponent } from '../countries/countries.component';
import { CmsCountriesService } from '../../../services/country/cms-countries.service';
import { HomeService } from '../../../services/main/home.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, WorldComponent, CountriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  mobileAlternateDisplayIsActive = false;

  constructor(
    private cmsCountriesService: CmsCountriesService,
    public homeService: HomeService,
  ) {}

  ngOnInit(): void {
    this.cmsCountriesService.countries.subscribe((data) => {
      // console.log(data);
    });
  }

  toggleMobileAlternateDisplay() {
    this.mobileAlternateDisplayIsActive = !this.mobileAlternateDisplayIsActive;
  }
}
