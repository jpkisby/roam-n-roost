import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { CmsArray } from '../../types/cms.types';
import { CmsCountry, Country } from '../../types/country.types';
import { entryCmsUrl } from '../../utils/cms';

const contentType = 'countryPage';

@Injectable({
  providedIn: 'root',
})
export class CmsCountriesService {
  countries: Observable<Country[]>;

  constructor(private httpClient: HttpClient) {
    this.countries = this.httpClient.get<CmsArray<CmsCountry>>(`${entryCmsUrl}&content_type=${contentType}`).pipe(
      tap((response) => {
        if (response.items.length === 0) {
          throw new Error('No countries found!');
        }
      }),
      map((response) =>
        response.items.map((country) => ({
          id: country.fields.id,
          name: country.fields.name,
          heroLarge: null,
        })),
      ),
    );
  }
}
