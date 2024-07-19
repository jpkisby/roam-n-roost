import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry, } from 'geojson';
import * as topojson from 'topojson';
import { Objects, Topology } from 'topojson-specification';

@Injectable({
  providedIn: 'root'
})
export class WorldService {
  world: Topology<Objects<GeoJsonProperties>> | undefined;
  countries: Feature<Geometry, GeoJsonProperties>[] = [];

  highlightedCountry: Feature<Geometry, GeoJsonProperties> | null = null;
  selectedCountry: Feature<Geometry, GeoJsonProperties> | null = null;

  constructor() { 
    this.#_loadWorld();
  }

  async #_loadWorld() {
    console.log('loading')
    this.world = await d3.json<Topology>("https://unpkg.com/world-atlas@2.0.2/countries-110m.json");
    if (!this.world) {
      throw new Error('World not found!')
    }
    const { features } = topojson.feature(this.world, this.world.objects['countries']) as FeatureCollection<Geometry, GeoJsonProperties>;
    this.countries = features;
  }
}
