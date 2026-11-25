import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiFileInput from '../../src/ui/UiFileInput.vue';

describe('UiFileInput', () => {
    it('is a labelled file field that emits the picked file, and null when the pick is cleared', async () => {
        const wrapper = mount(UiFileInput, { props: { label: 'File', modelValue: null, accept: '.xlsx,.csv', error: 'Pick a file.' } });
        const input = wrapper.get('input');

        expect(input.attributes('type')).toBe('file');
        expect(input.attributes('accept')).toBe('.xlsx,.csv');
        expect(wrapper.get('label').attributes('for')).toBe(input.attributes('id'));
        expect(input.attributes('aria-invalid')).toBe('true');

        const file = new File(['name,email'], 'members.csv', { type: 'text/csv' });
        Object.defineProperty(input.element, 'files', { value: { item: () => file }, configurable: true });
        await input.trigger('change');
        Object.defineProperty(input.element, 'files', { value: { item: () => null }, configurable: true });
        await input.trigger('change');

        expect(wrapper.emitted('update:modelValue')).toEqual([[file], [null]]);
    });
});
