import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import * as topojson from 'topojson';
import { Objects, Topology } from 'topojson-specification';
import { Country } from './types';

@Injectable({
  providedIn: 'root'
})
export class WorldService {
  #_loading = true;

  world: Topology<Objects<GeoJsonProperties>> | undefined;
  countries: Country[] = [];

  highlightedCountry: Country | null = null;
  selectedCountry: Country | null = null;

  constructor() { 
    this.#_loadWorld();
  }

  async #_loadWorld() {
    this.world = await d3.json<Topology>("https://unpkg.com/world-atlas@2.0.2/countries-110m.json");
    if (!this.world) {
      throw new Error('World not found!')
    }
    const { features } = topojson.feature(this.world, this.world.objects['countries']) as FeatureCollection<Geometry, GeoJsonProperties>;
    this.countries = (features as Country[]).sort((a, b) => {
      return a.properties?.['name'] > b.properties?.['name'] ? 1 : -1;
    });
    console.log(this.countries)

    this.#_loading = false;
  }
}
