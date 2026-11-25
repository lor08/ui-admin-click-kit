import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiRadioGroup from '../../src/ui/UiRadioGroup.vue';

const options = [
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email', description: 'A letter with the link' },
];

describe('UiRadioGroup', () => {
    it('is a fieldset of radios sharing a name, with the current one checked', async () => {
        const wrapper = mount(UiRadioGroup, { props: { modelValue: 'phone', label: 'Send by', options, name: 'channel' } });

        expect(wrapper.get('legend').text()).toBe('Send by');
        expect(wrapper.findAll('input').map((input) => input.attributes('name'))).toEqual(['channel', 'channel']);
        expect((wrapper.findAll('input')[0]?.element as HTMLInputElement).checked).toBe(true);
        expect(wrapper.text()).toContain('A letter with the link');

        await wrapper.findAll('input')[1]?.trigger('change');

        expect(wrapper.emitted('update:modelValue')).toEqual([['email']]);
    });

    it('shows one error for the whole group', () => {
        const wrapper = mount(UiRadioGroup, { props: { modelValue: '', options, error: 'Pick a channel.' } });

        expect(wrapper.get('fieldset').attributes('aria-invalid')).toBe('true');
        expect(wrapper.get('[data-test="error"]').text()).toBe('Pick a channel.');
    });

    it('draws a tree: headings in bold without a radio, each level indented', async () => {
        const tree = [
            { value: '2', label: 'Lost', depth: 0, group: true },
            { value: '3', label: '#NOT_SCHEDULED', depth: 1, group: true },
            { value: '27', label: 'Thinking', depth: 2 },
        ];
        const wrapper = mount(UiRadioGroup, { props: { modelValue: '', options: tree } });

        expect(wrapper.findAll('[data-test="radio-group-heading"]').map((heading) => [heading.text(), heading.attributes('style')])).toEqual([
            ['Lost', 'padding-left: 0rem;'],
            ['#NOT_SCHEDULED', 'padding-left: 1.25rem;'],
        ]);
        expect(wrapper.findAll('input').map((input) => input.attributes('value'))).toEqual(['27']);
        expect(wrapper.get('label').attributes('style')).toBe('padding-left: 2.5rem;');

        await wrapper.get('input').trigger('change');
        expect(wrapper.emitted('update:modelValue')).toEqual([['27']]);
    });
});
