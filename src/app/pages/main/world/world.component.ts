import { afterNextRender, AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Feature, GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';
import { AsyncSubject, BehaviorSubject, combineLatest, filter, forkJoin, Subscription, take } from 'rxjs';
import * as topojson from 'topojson';
import { Objects, Topology } from 'topojson-specification';
import { ExtendedD3GeoCountry } from '../../../services/main/types';
import { WorldService } from '../../../services/main/world.service';
import { ScreenSizeService } from '../../../services/utils/screen-size.service';
import { config } from './config';
import { RotateGlobe } from './rotation';

@Component({
  selector: 'app-world',
  standalone: true,
  imports: [],
  templateUrl: './world.component.html',
  styleUrl: './world.component.scss',
})
export class WorldComponent implements AfterViewInit, OnDestroy {
  // HTML elements
  @ViewChild('globe') globeRef: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('currentCountry') currentCountryRef: ElementRef<HTMLParagraphElement> | undefined;

  // Backend data
  #_world: Topology<Objects<GeoJsonProperties>> | null = null;
  #_countries: ExtendedD3GeoCountry[] = [];

  // Screen data
  #_projection = d3.geoOrthographic().precision(0.1);
  #_rotateGlobe = new RotateGlobe(this.#_projection, () => this.#_renderGlobeUpdates());
  #_globeContext: CanvasRenderingContext2D | null = null;

  // Observers and subscriptions
  #_globeDataIsReady = new BehaviorSubject<boolean>(false);
  #_resizeSubscription: Subscription | undefined;
  #_globeDataSubscription: Subscription | undefined;
  #_globeDataIsReadySubscription: Subscription | undefined;

  constructor(
    private worldService: WorldService,
    private screenSizeService: ScreenSizeService,
  ) {
    afterNextRender(() => {
      this.#_scaleGlobe();
      this.#_resizeSubscription = this.screenSizeService.resizeEvent().subscribe(() => {
        this.#_scaleGlobe();
      });
      this.#_globeDataIsReadySubscription = this.#_globeDataIsReady
        .pipe(
          filter((globeDataIsReady) => globeDataIsReady),
          take(1),
        )
        .subscribe(() => {
          this.#_init();
        });
    });
  }

  ngAfterViewInit(): void {
    this.#_globeDataSubscription = forkJoin([this.worldService.world, this.worldService.countries]).subscribe(
      ([world, countries]) => {
        this.#_world = world;
        this.#_countries = countries;
        this.#_globeDataIsReady.next(true);
      },
    );
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

  #_scaleGlobe() {
    // Verify UI setup
    if (!this.#_projection || !this.globeRef || !this.globeRef.nativeElement.parentElement) return;

    const padding = 16;

    const documentHeight = document.documentElement.clientHeight;
    const width = this.globeRef.nativeElement.parentElement.clientWidth - padding;
    const height = this.globeRef.nativeElement.parentElement.clientHeight - padding;
    this.globeRef.nativeElement.setAttribute('width', width + 'px');
    this.globeRef.nativeElement.setAttribute('height', height + 'px');

    const scaleFactor = this.screenSizeService.isScreenSizeDesktopUp()
      ? config.desktopScaleFactor
      : config.mobileScaleFactor;
    const size = Math.min(width, height, documentHeight) * scaleFactor;

    this.#_projection
      .fitSize([size, size], { type: 'FeatureCollection', features: this.#_countries })
      .translate([(width + padding) / 2, (height + padding) / 2]);
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
    if (!this.#_world || !this.#_globeContext) return;

    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    this.#_globeContext.clearRect(0, 0, width, height);
    // fill globe with water color
    this.#_fillCountry({ type: 'Sphere' }, config.colors.water);

    const land = topojson.feature(this.#_world, this.#_world.objects['land']);
    this.#_fillCountry(land, config.colors.land);

    if (this.worldService.highlightedCountry) {
      this.#_fillCountry(this.worldService.highlightedCountry, config.colors.hover);
    }
  }

  ngOnDestroy(): void {
    this.#_resizeSubscription?.unsubscribe();
    this.#_globeDataSubscription?.unsubscribe();
    this.#_globeDataIsReadySubscription?.unsubscribe();
  }
}
