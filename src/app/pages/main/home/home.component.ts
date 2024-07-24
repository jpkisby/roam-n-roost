import { Component, OnInit } from '@angular/core';
import { WorldComponent } from '../world/world.component';
import { CountriesComponent } from '../countries/countries.component';
import { CmsCountriesService } from '../../../services/country/cms-countries.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [WorldComponent, CountriesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private cmsCountriesService: CmsCountriesService) {}

  ngOnInit(): void {
    this.cmsCountriesService.countries.subscribe(data => {
      console.log(data)
    })
  }
}
