import { Feature, GeoJsonProperties, Polygon, MultiPolygon } from 'geojson';

export type D3GeoCountry = Feature<Polygon | MultiPolygon, GeoJsonProperties>;
export type ExtendedD3GeoCountry = D3GeoCountry & { existsInCms: boolean, nameInCms: string | null };