/// <reference types="google.maps" />
import { kitMaps, type MapsLoader } from './kit';

/** The shapes UiMap speaks in: plain GeoJSON and plain numbers, nothing of Google's. */
export interface MapPoint {
    lat: number;
    lng: number;
}

export interface MapBounds {
    west: number;
    south: number;
    east: number;
    north: number;
}

export type MapGeometry = { type: 'Polygon'; coordinates: number[][][] } | { type: 'MultiPolygon'; coordinates: number[][][][] };

export interface MapFeature {
    id: string;
    geometry: MapGeometry;
}

export interface MapFeatureStyle {
    visible?: boolean;
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    zIndex?: number;
}

export interface MapViewport {
    bounds: MapBounds;
    zoom: number;
}

/** The small panel in the corner of the map: what is under the pointer. */
export interface MapInfo {
    title: string;
    text?: string | null;
}

/** The browser key the host gave (`maps.key`); empty when the map is off. */
export function mapsKey(): string {
    return kitMaps().key;
}

/** The loader the host gave (`maps.loader`), or null when it gave none. */
export function mapsLoader(): MapsLoader | null {
    return kitMaps().loader;
}

const configured = new WeakSet<MapsLoader>();

/**
 * The loader takes its options once per page; a second call only warns.
 * The language is the app's, not the browser's, so an English screen does
 * not get a map labelled in the language of the machine.
 */
export function configureMaps(loader: MapsLoader, key: string, language: string): void {
    if (!configured.has(loader)) {
        loader.setOptions({ key, v: 'weekly', language });
        configured.add(loader);
    }
}

export function boundsIntersect(a: MapBounds, b: MapBounds): boolean {
    return !(a.east < b.west || a.west > b.east || a.north < b.south || a.south > b.north);
}

/** The bounds grown by a share of their size on every side. */
export function padBounds(bounds: MapBounds, ratio: number): MapBounds {
    const lat = (bounds.north - bounds.south) * ratio;
    const lng = (bounds.east - bounds.west) * ratio;

    return { north: bounds.north + lat, south: bounds.south - lat, east: bounds.east + lng, west: bounds.west - lng };
}

/** An address as a US form holds it: the fields a Google suggestion fills. */
export interface PlaceAddress {
    line1: string;
    /** The unit (Google's `subpremise`), the second line of the street. */
    line2: string;
    city: string;
    state: string;
    zip: string;
}

/** The part of a Google address component the parsing reads. */
export interface PlaceComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

/** Where a city may sit in a Google address, most likely first. */
const CITY_TYPES = ['locality', 'postal_town', 'sublocality', 'sublocality_level_1', 'sublocality_level_2', 'neighborhood', 'administrative_area_level_3', 'administrative_area_level_2'];

/**
 * A Google place turned into street, city, state and zip: the street is
 * the number and the route, the unit its second line, the state its
 * two-letter code, the zip its five digits.
 */
export function placeToAddress(components: PlaceComponent[]): PlaceAddress {
    const find = (type: string): PlaceComponent | undefined => components.find((component) => component.types.includes(type));
    const long = (type: string): string => find(type)?.long_name ?? '';

    const city = CITY_TYPES.map(long).find((name) => name !== '') ?? '';
    const state = find('administrative_area_level_1');

    return {
        line1: [long('street_number'), long('route')].filter((part) => part !== '').join(' '),
        line2: long('subpremise'),
        city,
        state: state?.short_name ?? '',
        zip: long('postal_code').replace(/\D/g, '').slice(0, 5),
    };
}

/** One Google suggestion for a typed address: what it reads and the place it names. */
export interface PlaceHint {
    description: string;
    placeId: string;
}

/**
 * Up to `limit` Google suggestions for a typed address in a country.
 * Without a Maps key and loader, or when Google does not answer, there are
 * none.
 */
export async function placeHints(text: string, language: string, country = 'us', limit = 3): Promise<PlaceHint[]> {
    const key = mapsKey();
    const loader = mapsLoader();
    if (key === '' || loader === null || text.trim() === '') {
        return [];
    }
    try {
        configureMaps(loader, key, language);
        const { AutocompleteService } = (await loader.importLibrary('places')) as google.maps.PlacesLibrary;
        const { predictions } = await new AutocompleteService().getPlacePredictions({ input: text, componentRestrictions: { country }, types: ['address'] });

        return predictions.slice(0, limit).map((prediction) => ({ description: prediction.description, placeId: prediction.place_id }));
    } catch {
        return [];
    }
}

/** The address of a suggested place, parsed as UiPlaceInput parses it; null when Google does not answer. */
export async function placeAddress(placeId: string, language: string): Promise<PlaceAddress | null> {
    const key = mapsKey();
    const loader = mapsLoader();
    if (key === '' || loader === null) {
        return null;
    }
    try {
        configureMaps(loader, key, language);
        const { PlacesService } = (await loader.importLibrary('places')) as google.maps.PlacesLibrary;
        const service = new PlacesService(document.createElement('div'));

        return await new Promise((resolve) => {
            service.getDetails({ placeId, fields: ['address_components'] }, (place, status) => {
                resolve(status === 'OK' && place?.address_components ? placeToAddress(place.address_components as PlaceComponent[]) : null);
            });
        });
    } catch {
        return null;
    }
}
