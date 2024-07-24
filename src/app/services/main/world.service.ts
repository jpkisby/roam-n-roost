import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import * as topojson from 'topojson';
import { Objects, Topology } from 'topojson-specification';
import { D3GeoCountry, ExtendedD3GeoCountry } from './types';
import { CmsCountriesService } from '../country/cms-countries.service';
import { Country } from '../../types/country.types';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorldService {
  #_world = new BehaviorSubject<Topology<Objects<GeoJsonProperties>> | null>(null);
  world = this.#_world.asObservable();
  countries: Observable<ExtendedD3GeoCountry[]>;

  highlightedCountry: ExtendedD3GeoCountry | null = null;
  selectedCountry: ExtendedD3GeoCountry | null = null;

  constructor(private cmsCountriesService: CmsCountriesService) {
    this.#_loadWorld();
    this.countries = combineLatest([
      this.cmsCountriesService.countries,
      this.#_world.asObservable()
    ]).pipe(map(([countries, world]) => this.#_mapCountries(countries, world)));
  }

  async #_loadWorld() {
    const newWorld = await d3.json<Topology>("https://unpkg.com/world-atlas@2.0.2/countries-110m.json");
    if (!newWorld) {
      throw new Error('World not found!')
    }
    this.#_world.next(newWorld);
    this.#_world.complete();
  }

  #_mapCountries(countries: Country[], world: Topology<Objects<GeoJsonProperties>> | null): ExtendedD3GeoCountry[] {
    if (!world) {
      return [];
    }

    const { features } = topojson.feature(world, world.objects['countries']) as FeatureCollection<Geometry, GeoJsonProperties>;
    return (features as D3GeoCountry[])
      .sort((a, b) => a.properties?.['name'] > b.properties?.['name'] ? 1 : -1)
      .map(feature => {
        const cmsCountry = countries.find(country => country.id === feature.id);
        return {
          ...feature,
          existsInCms: !!cmsCountry,
          nameInCms: cmsCountry?.name || null
        }
      })
    }
}
