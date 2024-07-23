import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { CmsArray } from '../../types/cms.types';
import { CmsCountry, Country } from '../../types/country.types';
import { baseCmsUrl } from '../../utils/cms';

const contentType = 'countryPage';

@Injectable({
  providedIn: 'root'
})
export class CmsCountryService {

  constructor(private httpClient: HttpClient) { }

  getCmsCountry(id: string): Observable<Country> {
    return this.httpClient.get<CmsArray<CmsCountry>>(`${baseCmsUrl}&content_type=${contentType}&fields.id=${id}`).pipe(
      tap((response) => {
        if (response.items.length === 0) {
          throw new Error('No country found!')
        }
      }),
      map((response) => ({
        id: response.items[0].fields.id,
        name: response.items[0].fields.name
      }))
    )
  }
}
