import { vi } from 'vitest';

type Handler = (event?: unknown) => void;

/** One google.maps.Data.Feature: its id is all a spec needs. */
export class FakeFeature {
    constructor(private readonly id: string, public readonly geometry: unknown) {}

    getId(): string {
        return this.id;
    }
}

/** google.maps.Data with the calls UiMap makes, and a way to fire its events. */
export class FakeData {
    features: FakeFeature[] = [];
    style: ((feature: FakeFeature) => Record<string, unknown>) | null = null;
    handlers: Record<string, Handler> = {};
    added = 0;

    addGeoJson(json: { id: string; geometry: unknown }): FakeFeature[] {
        const feature = new FakeFeature(json.id, json.geometry);
        this.features.push(feature);
        this.added++;

        return [feature];
    }

    remove(feature: FakeFeature): void {
        this.features = this.features.filter((candidate) => candidate !== feature);
    }

    setStyle(style: (feature: FakeFeature) => Record<string, unknown>): void {
        this.style = style;
    }

    addListener(name: string, handler: Handler) {
        this.handlers[name] = handler;

        return { remove: vi.fn() };
    }

    ids(): string[] {
        return this.features.map((feature) => feature.getId()).sort();
    }

    styleOf(id: string): Record<string, unknown> {
        const feature = this.features.find((candidate) => candidate.getId() === id);

        return feature && this.style ? this.style(feature) : {};
    }

    fire(name: string, id: string | null = null): void {
        const feature = this.features.find((candidate) => candidate.getId() === id);
        this.handlers[name]?.(feature ? { feature } : {});
    }
}

/** google.maps.Map as UiMap uses it; the last one made is in `FakeMap.last`. */
export class FakeMap {
    static last: FakeMap | null = null;

    data = new FakeData();
    handlers: Record<string, Handler> = {};
    bounds = { west: -123, south: 37, east: -121, north: 38.5 };
    zoom: number;
    fitBounds = vi.fn();

    constructor(
        public readonly element: HTMLElement,
        public readonly options: { center: { lat: number; lng: number }; zoom: number },
    ) {
        this.zoom = options.zoom;
        FakeMap.last = this;
    }

    addListener(name: string, handler: Handler) {
        this.handlers[name] = handler;

        return { remove: vi.fn() };
    }

    getBounds() {
        return { toJSON: () => this.bounds };
    }

    getZoom(): number {
        return this.zoom;
    }

    /** The map settles after a pan or a zoom. */
    idle(bounds = this.bounds, zoom = this.zoom): void {
        this.bounds = bounds;
        this.zoom = zoom;
        this.handlers.idle?.();
    }
}

/** google.maps.places.Autocomplete as UiPlaceInput uses it; the last one made is in `FakeAutocomplete.last`. */
export class FakeAutocomplete {
    static last: FakeAutocomplete | null = null;

    place: { address_components?: { long_name: string; short_name: string; types: string[] }[]; formatted_address?: string } = {};
    handlers: Record<string, Handler> = {};

    constructor(
        public readonly input: HTMLInputElement,
        public readonly options: Record<string, unknown>,
    ) {
        FakeAutocomplete.last = this;
    }

    addListener(name: string, handler: Handler) {
        this.handlers[name] = handler;

        return { remove: vi.fn() };
    }

    getPlace() {
        return this.place;
    }

    /** The person picks a suggestion. */
    pick(place: FakeAutocomplete['place']): void {
        this.place = place;
        this.handlers.place_changed?.();
    }
}

/** The loader a spec gives the kit as `maps.loader`, standing in for the loader module. */
export function loaderMock() {
    return {
        setOptions: vi.fn(),
        importLibrary: vi.fn(async () => ({ Map: FakeMap, Autocomplete: FakeAutocomplete })),
    };
}
