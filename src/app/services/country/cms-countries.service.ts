import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, BehaviorSubject, map, tap } from 'rxjs';
import { CmsArray } from '../../types/cms.types';
import { CmsCountry, Country } from '../../types/country.types';
import { baseCmsUrl } from '../../utils/cms';

const contentType = 'countryPage';

@Injectable({
  providedIn: 'root'
})
export class CmsCountriesService {
  #_countries = new BehaviorSubject<Country[]>([]);
  countries = this.#_countries.asObservable();

  constructor(private httpClient: HttpClient) {
    this.#_init();
  }

  #_init() {
    this.httpClient.get<CmsArray<CmsCountry>>(`${baseCmsUrl}&content_type=${contentType}`).pipe(
      tap((response) => {
        if (response.items.length === 0) {
          throw new Error('No countries found!')
        }
      }),
      map((response) => response.items.map(country => ({
        id: country.fields.id,
        name: country.fields.name
      })))
    ).subscribe(countries => {
      this.#_countries.next(countries);
    })
  }
}
