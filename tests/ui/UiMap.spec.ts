import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UiMap from '../../src/ui/UiMap.vue';
import type { MapGeometry } from '../../src/ui/map';
import { configureUiKit } from '../../src/ui/kit';
import { FakeMap, loaderMock } from '../support/googleMaps';

let loader = loaderMock();

/** The host turns the map on with a key and the loader module; a blank key keeps it off. */
function maps(key: string): void {
    loader = loaderMock();
    configureUiKit({ maps: { key, loader } });
}

const square = (lng: number, lat: number): MapGeometry => ({
    type: 'Polygon',
    coordinates: [[[lng, lat], [lng + 0.1, lat], [lng + 0.1, lat + 0.1], [lng, lat + 0.1], [lng, lat]]],
});

afterEach(() => {
    FakeMap.last = null;
});

describe('UiMap', () => {
    it('says the map is off instead of loading it when there is no key', async () => {
        maps('');
        const wrapper = mount(UiMap, { props: { features: [{ id: 'A1', geometry: square(-122.4, 37.7) }] } });
        await flushPromises();

        expect(wrapper.get('[data-test="map"]').attributes('data-status')).toBe('no-key');
        expect(wrapper.get('[data-test="map-placeholder"]').text()).toContain('The map is off');
        expect(wrapper.get('[data-test="map-placeholder"]').text()).toContain('Set VITE_GOOGLE_MAPS_KEY in .env');
        expect(loader.importLibrary).not.toHaveBeenCalled();
        expect(FakeMap.last).toBeNull();
    });

    it('keeps the map off when the host gives a key but no loader', async () => {
        configureUiKit({ maps: { key: 'test-key' } });
        const wrapper = mount(UiMap, { props: { features: [{ id: 'A1', geometry: square(-122.4, 37.7) }] } });
        await flushPromises();

        expect(wrapper.get('[data-test="map"]').attributes('data-status')).toBe('no-key');
        expect(FakeMap.last).toBeNull();
    });

    it('loads in the language of the app, draws the features, keeps them in step with the prop and paints them with the style it is given', async () => {
        maps('test-key');
        const a = square(-122.4, 37.7);
        const b = square(-122.2, 37.8);
        const wrapper = mount(UiMap, {
            props: {
                center: { lat: 34.05, lng: -118.24 },
                zoom: 8,
                features: [{ id: 'A1', geometry: a }, { id: 'A2', geometry: b }],
                featureStyle: (id: string) => ({ fillColor: id === 'A1' ? '#2196F3' : '#9e9e9e' }),
            },
        });
        await flushPromises();
        const map = FakeMap.last as FakeMap;

        expect(wrapper.get('[data-test="map"]').attributes('data-status')).toBe('ready');
        expect(loader.setOptions).toHaveBeenCalledWith(expect.objectContaining({ key: 'test-key', language: 'en' }));
        expect(wrapper.emitted('ready')).toHaveLength(1);
        expect(map.options).toEqual({ center: { lat: 34.05, lng: -118.24 }, zoom: 8 });
        expect(map.data.ids()).toEqual(['A1', 'A2']);
        expect(map.data.styleOf('A1')).toEqual({ fillColor: '#2196F3' });

        const fine = square(-122.41, 37.71);
        await wrapper.setProps({ features: [{ id: 'A1', geometry: fine }, { id: 'B1', geometry: square(-122.3, 37.7) }] });
        expect(map.data.ids()).toEqual(['A1', 'B1']);
        expect(map.data.features.find((feature) => feature.getId() === 'A1')?.geometry).toEqual(fine);
        expect(map.data.added).toBe(4);

        await wrapper.setProps({ features: [{ id: 'A1', geometry: fine }, { id: 'B1', geometry: square(-122.3, 37.7) }] });
        expect(map.data.added).toBe(5);

        await wrapper.setProps({ featureStyle: () => ({ visible: false }) });
        expect(map.data.styleOf('B1')).toEqual({ visible: false });
    });

    it('reports clicks, the pointer and the viewport, and fits the bounds it is asked to', async () => {
        maps('test-key');
        const wrapper = mount(UiMap, { props: { features: [{ id: 'A1', geometry: square(-122.4, 37.7) }], info: { title: 'A1', text: 'Area A1, north' } } });
        await flushPromises();
        const map = FakeMap.last as FakeMap;

        map.data.fire('click', 'A1');
        map.data.fire('mouseover', 'A1');
        map.data.fire('mouseout');
        map.idle({ west: -122.5, south: 37.6, east: -122.3, north: 37.8 }, 11);

        expect(wrapper.emitted('feature-click')).toEqual([['A1']]);
        expect(wrapper.emitted('feature-hover')).toEqual([['A1'], [null]]);
        expect(wrapper.emitted('viewport')).toEqual([[{ bounds: { west: -122.5, south: 37.6, east: -122.3, north: 37.8 }, zoom: 11 }]]);

        await wrapper.vm.$nextTick();
        expect(wrapper.findAll('[data-test="map-info"] span').map((span) => span.text())).toEqual(['A1', 'Area A1, north']);

        (wrapper.vm as unknown as { fitBounds: (bounds: object) => void }).fitBounds({ west: 1, south: 2, east: 3, north: 4 });
        expect(map.fitBounds).toHaveBeenCalledWith({ west: 1, south: 2, east: 3, north: 4 });
    });

    it('covers the canvas with the loading label while the parent loads', async () => {
        maps('test-key');
        const wrapper = mount(UiMap, { props: { loading: true, loadingLabel: 'Loading polygons…' } });
        await flushPromises();

        expect(wrapper.get('[data-test="map-loading"]').text()).toBe('Loading polygons…');

        await wrapper.setProps({ loading: false });
        expect(wrapper.find('[data-test="map-loading"]').exists()).toBe(false);
    });
});
