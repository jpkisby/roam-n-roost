import { Routes } from '@angular/router';
import { CountryComponent } from './pages/country/country.component';
import { HomeComponent } from './pages/main/home/home.component';

export const routes: Routes = [
    { path: 'country/:name', component: CountryComponent },
    { path: '', component: HomeComponent }
];
