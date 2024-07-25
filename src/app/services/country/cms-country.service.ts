import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { CmsArray } from '../../types/cms.types';
import { CmsCountry, Country } from '../../types/country.types';
import { cmsAssetToAsset, entryCmsUrl } from '../../utils/cms';

const contentType = 'countryPage';

@Injectable({
  providedIn: 'root'
})
export class CmsCountryService {

  constructor(private httpClient: HttpClient) { }

  getCmsCountry(name: string): Observable<Country> {
    return this.httpClient.get<CmsArray<CmsCountry>>(`${entryCmsUrl}&content_type=${contentType}&fields.name[match]=${name}`).pipe(
      tap((response) => {
        if (response.items.length === 0) {
          throw new Error('No country found!')
        }
      }),
      map((response) => {
        const heroLargeId = response.items[0].fields.heroLarge.sys.id;
        const heroLargeAsset = response.includes.Asset.find(asset => asset.sys.id === heroLargeId);

        return {
        id: response.items[0].fields.id,
        name: response.items[0].fields.name,
        heroLarge: heroLargeAsset ? cmsAssetToAsset(heroLargeAsset) : null
      }})
    )
  }
}
