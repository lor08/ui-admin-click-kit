import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UiPlaceInput from '../../src/ui/UiPlaceInput.vue';
import { configureUiKit } from '../../src/ui/kit';
import { FakeAutocomplete, loaderMock } from '../support/googleMaps';

let loader = loaderMock();

/** The host turns the map on with a key and the loader module; a blank key keeps it off. */
function maps(key: string): void {
    loader = loaderMock();
    configureUiKit({ maps: { key, loader } });
}

afterEach(() => {
    FakeAutocomplete.last = null;
});

describe('UiPlaceInput', () => {
    it('without a Maps key is a plain text box that reports what is typed', async () => {
        maps('');
        const wrapper = mount(UiPlaceInput, { props: { modelValue: '', label: 'Find the address', placeholder: 'Start typing the address' } });
        await flushPromises();

        expect(FakeAutocomplete.last).toBeNull();
        expect(wrapper.get('label').text()).toContain('Find the address');
        expect(wrapper.get('input').attributes('placeholder')).toBe('Start typing the address');
        await wrapper.get('input').setValue('12 Elm');
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['12 Elm']);
    });

    it('with a key asks Google for US addresses and hands the parsed suggestion to the form', async () => {
        maps('test-key');
        const wrapper = mount(UiPlaceInput, { props: { modelValue: '' } });
        await flushPromises();

        const autocomplete = FakeAutocomplete.last;
        expect(autocomplete?.input).toBe(wrapper.get('input').element);
        expect(autocomplete?.options).toMatchObject({ componentRestrictions: { country: 'us' }, types: ['address'] });

        autocomplete?.pick({
            formatted_address: '12 Elm Street, Springfield, IL 62704, USA',
            address_components: [
                { long_name: '12', short_name: '12', types: ['street_number'] },
                { long_name: 'Elm Street', short_name: 'Elm St', types: ['route'] },
                { long_name: 'Springfield', short_name: 'Springfield', types: ['locality'] },
                { long_name: 'Illinois', short_name: 'IL', types: ['administrative_area_level_1'] },
                { long_name: '62704', short_name: '62704', types: ['postal_code'] },
            ],
        });

        expect(wrapper.emitted('place')?.[0]).toEqual([{ line1: '12 Elm Street', line2: '', city: 'Springfield', state: 'IL', zip: '62704' }]);
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['12 Elm Street, Springfield, IL 62704, USA']);
    });
});
