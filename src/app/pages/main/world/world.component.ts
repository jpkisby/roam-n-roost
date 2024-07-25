import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Feature, GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';
import * as topojson from 'topojson';
import { WorldService } from '../../../services/main/world.service';
import { config } from './config';
import { RotateGlobe } from './rotation';
import { Objects, Topology } from 'topojson-specification';
import { combineLatest } from 'rxjs';
import { ExtendedD3GeoCountry } from '../../../services/main/types';

@Component({
  selector: 'app-world',
  standalone: true,
  imports: [],
  templateUrl: './world.component.html',
  styleUrl: './world.component.scss',
})
export class WorldComponent implements AfterViewInit {
  @ViewChild('globe') globeRef: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('currentCountry') currentCountryRef: ElementRef<HTMLParagraphElement> | undefined;

  #_projection = d3.geoOrthographic().precision(0.1);
  #_rotateGlobe = new RotateGlobe(this.#_projection, () => this.#_renderGlobeUpdates());
  #_globeContext: CanvasRenderingContext2D | null = null;

  #_world: Topology<Objects<GeoJsonProperties>> | null = null;
  #_countries: ExtendedD3GeoCountry[] = [];

  constructor(private worldService: WorldService) {}

  ngAfterViewInit(): void {
    combineLatest([this.worldService.world, this.worldService.countries]).subscribe(([world, countries]) => {
      this.#_world = world;
      this.#_countries = countries;
      this.#_init();
    });
  }

  #_init() {
    // Verify UI setup
    if (!this.globeRef) {
      throw new Error('Could not generate world!');
    }

    this.#_globeContext = this.globeRef.nativeElement.getContext('2d');
    this.#_scaleGlobe();
    this.#_rotateGlobe.setup();
    d3.select('#globe').on('mousemove', (event: MouseEvent) => this.#_hover(event));
  }

  /**
   * Scale up the globe to look nnice on the page.
   */
  #_scaleGlobe() {
    // Verify UI setup
    if (!this.#_projection || !this.globeRef) return;

    const width = document.documentElement.clientWidth * config.scaleFactor;
    const height = document.documentElement.clientHeight * config.scaleFactor;
    this.globeRef.nativeElement.setAttribute('width', width + 'px');
    this.globeRef.nativeElement.setAttribute('height', height + 'px');
    this.#_projection.scale(Math.min(width, height) / 2).translate([width / 2, height / 2]);
    this.#_renderGlobeUpdates();
  }

  #_enterCountry(country: Feature<Geometry, GeoJsonProperties>) {
    if (!this.currentCountryRef) return;

    this.currentCountryRef.nativeElement.innerText = country.properties?.['name'];
  }

  #_leaveCountry() {
    if (!this.currentCountryRef) return;

    this.currentCountryRef.nativeElement.innerText = '';
  }

  #_getCountry = (event: MouseEvent) => {
    const position = this.#_projection?.invert?.(d3.pointer(event));

    if (!this.#_countries.length || !position) return null;

    return this.#_countries.find((country) => {
      const geometry = country.geometry as Polygon | MultiPolygon;
      return geometry.coordinates.find(
        (c1) =>
          d3.polygonContains(c1 as [number, number][], position) ||
          c1.some((c2) => d3.polygonContains(c2 as [number, number][], position)),
      );
    });
  };

  #_hover(event: MouseEvent) {
    const country = this.#_getCountry(event);
    if (!country) {
      if (this.worldService.highlightedCountry) {
        this.#_leaveCountry();
        this.worldService.highlightedCountry = null;
        this.#_renderGlobeUpdates();
      }
      return;
    }
    if (country === this.worldService.highlightedCountry) {
      return;
    }
    if (country.existsInCms) {
      this.worldService.highlightedCountry = country;
      this.#_renderGlobeUpdates();
      this.#_enterCountry(country);
    }
  }

  #_fillCountry(obj: d3.GeoPermissibleObjects, color: string | CanvasGradient | CanvasPattern) {
    if (!this.#_globeContext) return;

    this.#_globeContext.beginPath();
    const path = d3.geoPath(this.#_projection).context(this.#_globeContext ?? null);
    path(obj);
    this.#_globeContext.fillStyle = color;
    this.#_globeContext.fill();
  }

  #_renderGlobeUpdates() {
    // Verify data setup
    if (!this.#_world) return;

    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    // TODO julie what does this do?
    this.#_globeContext?.clearRect(0, 0, width, height);
    // fill globe with water color
    this.#_fillCountry({ type: 'Sphere' }, config.colors.water);

    const land = topojson.feature(this.#_world, this.#_world.objects['land']);
    this.#_fillCountry(land, config.colors.land);

    if (this.currentCountryRef && this.worldService.highlightedCountry) {
      this.currentCountryRef.nativeElement.classList.add('visible');
      this.#_fillCountry(this.worldService.highlightedCountry, config.colors.hover);
    }
  }
}
