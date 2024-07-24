import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountryComponent } from './pages/country/country.component';
import { HomeComponent } from './pages/main/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, CountryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'roam-n-roost';
}
