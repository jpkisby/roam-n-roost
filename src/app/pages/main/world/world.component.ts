import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Feature, GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';
import * as topojson from 'topojson';
import { WorldService } from '../../../services/main/world.service';
import { config } from './config';
import { RotateGlobe } from './rotation';

@Component({
  selector: 'app-world',
  standalone: true,
  imports: [],
  templateUrl: './world.component.html',
  styleUrl: './world.component.scss'
})
export class WorldComponent implements AfterViewInit {
  @ViewChild('globe') globeRef: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('currentCountry') currentCountryRef: ElementRef<HTMLParagraphElement> | undefined;

  private projection = d3.geoOrthographic().precision(0.1);
  private rotateGlobe = new RotateGlobe(this.projection, () => this.#_renderGlobe());
  private globeContext: CanvasRenderingContext2D | null = null;

  constructor(private worldService: WorldService) {}

  ngAfterViewInit(): void {
    if (!this.globeRef) {
      throw new Error('Could not generate world!')
    }

    this.globeContext = this.globeRef.nativeElement.getContext('2d');
    this.#_scaleGlobe();
    this.rotateGlobe.setup();
    d3.select('#globe').on('mousemove', (event: MouseEvent) => this.#_hover(event));
  }

  #_enterCountry(country: Feature<Geometry, GeoJsonProperties>) {
    if (!this.currentCountryRef) return;

    this.currentCountryRef.nativeElement.innerText = country.properties?.['name'];
  };
  
  #_leaveCountry() {
    if (!this.currentCountryRef) return;

    this.currentCountryRef.nativeElement.innerText = '';
  };

  #_getCountry = (event: MouseEvent) => {
    const position = this.projection?.invert?.(d3.pointer(event));

    if (!this.worldService.countries || !position) return null;

    return this.worldService.countries.find((country) =>
    {
      const geometry = country.geometry as Polygon | MultiPolygon;
      return geometry.coordinates.find(
        (c1) => d3.polygonContains(c1 as [number, number][], position) || c1.some((c2) => d3.polygonContains(c2 as [number, number][], position))
      )
    }
    );
  };

  #_hover(event: MouseEvent) {
    const country = this.#_getCountry(event);
    if (!country) {
        if (this.worldService.highlightedCountry) {
            this.#_leaveCountry();
            this.worldService.highlightedCountry = null;
            this.#_renderGlobe();
        }
        return;
    }
    if (country === this.worldService.highlightedCountry) {
        return;
    }
    this.worldService.highlightedCountry = country;
    this.#_renderGlobe();
    this.#_enterCountry(country);
  }

  #_fillCountry(obj: d3.GeoPermissibleObjects, color: string | CanvasGradient | CanvasPattern) {
    if (!this.globeContext) return;

    this.globeContext.beginPath();
    const path = d3.geoPath(this.projection).context(this.globeContext ?? null);
    path(obj);
    this.globeContext.fillStyle = color;
    this.globeContext.fill();
  };

  #_renderGlobe() {
    if (!this.worldService.world) return;

    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    this.globeContext?.clearRect(0, 0, width, height);
    this.#_fillCountry({ type: 'Sphere' }, config.colors.water);

    const land = topojson.feature(this.worldService.world, this.worldService.world.objects['land']);
    this.#_fillCountry(land, config.colors.land);

    if (this.currentCountryRef && this.worldService.highlightedCountry) {
        this.currentCountryRef.nativeElement.classList.add('visible')
        this.#_fillCountry(this.worldService.highlightedCountry, config.colors.hover);
    }
  }

  #_scaleGlobe() {
    if (!this.projection || !this.globeRef) return;

    const width = document.documentElement.clientWidth * config.scaleFactor;
    const height = document.documentElement.clientHeight * config.scaleFactor;
    this.globeRef.nativeElement.setAttribute('width', width + 'px');
    this.globeRef.nativeElement.setAttribute('height', height + 'px');
    this.projection
      .scale(Math.min(width, height) / 2)
      .translate([width / 2, height / 2]);
    this.#_renderGlobe();
  };
}
