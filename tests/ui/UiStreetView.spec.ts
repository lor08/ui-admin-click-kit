import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import UiStreetView from '../../src/ui/UiStreetView.vue';
import { configureUiKit } from '../../src/ui/kit';

/** The component reads the key when it is set up, so each case gives it before mounting. */
function withKey(key: string): void {
    configureUiKit({ maps: { key } });
}

async function streetView(props: { address: string | null; unit?: string | null }) {
    return mount(UiStreetView, { props, global: { stubs: { teleport: true } } });
}

describe('UiStreetView', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('shows nothing without a key or an address', async () => {
        withKey('');
        expect((await streetView({ address: '1 Elm St, Springfield, IL 62704' })).find('[data-test="street-view"]').exists()).toBe(false);

        withKey('key');
        expect((await streetView({ address: null })).find('[data-test="street-view"]').exists()).toBe(false);
    });

    it('shows Street View where Google has a panorama, with the unit under it', async () => {
        withKey('key');
        const fetch = vi.fn(async () => ({ json: async () => ({ status: 'OK' }) }));
        vi.stubGlobal('fetch', fetch);

        const wrapper = await streetView({ address: '1 Elm St, Springfield, IL 62704', unit: 'Apt 2' });
        await flushPromises();

        expect(fetch).toHaveBeenCalledWith('https://maps.googleapis.com/maps/api/streetview/metadata?location=1%20Elm%20St%2C%20Springfield%2C%20IL%2062704&key=key');
        const picture = wrapper.get('[data-test="street-view-picture"]');
        expect(picture.attributes('src')).toBe('https://maps.googleapis.com/maps/api/streetview?size=640x360&location=1%20Elm%20St%2C%20Springfield%2C%20IL%2062704&fov=90&key=key');
        expect(picture.attributes('alt')).toBe('Street View of the address');
        expect(wrapper.get('[data-test="street-view-unit"]').text()).toBe('Unit: Apt 2');
    });

    it('falls back to a map with a pin, and hides itself when Google refuses the picture', async () => {
        withKey('key');
        vi.stubGlobal('fetch', vi.fn(async () => ({ json: async () => ({ status: 'ZERO_RESULTS' }) })));

        const wrapper = await streetView({ address: '1 Elm St' });
        await flushPromises();

        const picture = wrapper.get('[data-test="street-view-picture"]');
        expect(picture.attributes('src')).toBe('https://maps.googleapis.com/maps/api/staticmap?center=1%20Elm%20St&zoom=15&size=640x360&markers=color:red%7C1%20Elm%20St&key=key&scale=2');
        expect(picture.attributes('alt')).toBe('Map of the address');

        await picture.trigger('error');
        expect(wrapper.find('[data-test="street-view"]').exists()).toBe(false);
    });
});
