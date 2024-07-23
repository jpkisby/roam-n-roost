import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorldComponent } from './pages/main/world/world.component';
import { CountriesComponent } from './pages/main/countries/countries.component';
import { CountryComponent } from './pages/country/country.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WorldComponent, CountriesComponent, CountryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'roam-n-roost';
}
