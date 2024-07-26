import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { entryCmsUrl } from '../../utils/cms';
import { CmsArray } from '../../types/cms.types';
import { CmsHomePage, HomePage } from '../../types/homePage.types';
import { map, Observable } from 'rxjs';

const contentType = 'homePage';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  homePage: Observable<HomePage>;

  constructor(private httpClient: HttpClient) {
    this.homePage = this.#_getHomePage();
  }

  #_getHomePage(): Observable<HomePage> {
    return this.httpClient
      .get<CmsArray<CmsHomePage>>(`${entryCmsUrl}&content_type=${contentType}`)
      .pipe(map((response) => ({ landing: response.items[0].fields.landing })));
  }
}
