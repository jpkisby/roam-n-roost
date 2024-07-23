import { Feature, GeoJsonProperties, Polygon, MultiPolygon } from 'geojson';

export type Country = Feature<Polygon | MultiPolygon, GeoJsonProperties>;