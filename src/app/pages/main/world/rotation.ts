import * as d3 from 'd3';
import { Country } from '../../../services/main/types';
import { config } from './config';

export class RotateGlobe {
    #_isDragging: boolean;
    #_startX: number;
    #_startY: number;
    #_lastTime: number;
    #_autorotate: d3.Timer | null = null;

    #_projection: d3.GeoProjection;
    #_callbackAfterRotation: Function;

    constructor(projection: d3.GeoProjection, callbackAfterRotation: Function) {
        this.#_isDragging = false;
        this.#_startX = 0;
        this.#_startY = 0;
        this.#_lastTime = d3.now();
        this.#_projection = projection;
        this.#_callbackAfterRotation = callbackAfterRotation;
    }

    setup() {
        
    const rotation = this.#_projection.rotate();
    rotation[0] = config.angles.x;
    rotation[1] = config.angles.y;
    rotation[2] = config.angles.z;
    this.#_projection.rotate(rotation);

        d3.select('#globe').call(
            (d3.drag() as any)
            .on('start', (event: DragEvent) => this.startDragGlobe(event))
            .on('drag', (event: DragEvent) => this.dragGlobe(event))
            .on('end', () => this.endDragGlobe())
        );

        this.#_autorotate = d3.timer((elapsed) => this.#_rotate(elapsed));
    }

    startDragGlobe(event: DragEvent) {
        this.#_isDragging = true;
        this.#_startX = event.x;
        this.#_startY = event.y;
        this.#_autorotate?.stop();
    }

    dragGlobe(event: DragEvent) {
        if (!this.#_isDragging) return;

        const dx = (event.x - this.#_startX) * config.rotationSensitivity;
        const dy = (event.y - this.#_startY) * config.rotationSensitivity;

        this.#_startX = event.x;
        this.#_startY = event.y;

        const rotation = this.#_projection.rotate();
        rotation[0] += dx;
        rotation[1] -= dy;
        this.#_projection.rotate(rotation);

        this.#_callbackAfterRotation();
    }

    endDragGlobe() {
        this.#_isDragging = false;
        this.#_autorotate?.restart((elapsed) => this.#_rotate(elapsed));
    }

    #_rotate(elapsed: number) {
        const now = d3.now();
        const diff = now - this.#_lastTime;
        if (diff < elapsed) {
            const rotation = this.#_projection.rotate();
            rotation[0] += diff * config.degPerSec / 1000;
            this.#_projection.rotate(rotation);
            this.#_callbackAfterRotation();
        }
        this.#_lastTime = now;
    };

    rotateCountryIntoView(country: Country) {
        const rotation = this.#_projection.rotate();
        rotation[0] = typeof country.geometry.coordinates[0][0][0] === 'number' ? country.geometry.coordinates[0][0][0] : country.geometry.coordinates[0][0][0][0]
        rotation[1] = typeof country.geometry.coordinates[0][0][0] === 'number' ? country.geometry.coordinates[0][0][0] : country.geometry.coordinates[0][0][0][0]
        this.#_projection.rotate(rotation);
    }
}