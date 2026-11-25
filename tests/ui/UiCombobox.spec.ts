import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiCombobox from '../../src/ui/UiCombobox.vue';

const options = [
    { key: 'create', name: 'Create "ann"' },
    { key: 'ann', name: 'Jane Doe' },
    { key: 'hint', name: '12 Elm Street', heading: 'Address suggestions' },
];

describe('UiCombobox', () => {
    it('lists the options under the box with a caption where a group starts, and picks one by keyboard or click', async () => {
        const wrapper = mount(UiCombobox, {
            props: { modelValue: '', options, label: 'Find a person', message: null },
            slots: { option: '<template #option="{ option }">{{ option.name }}</template>' },
        });
        const input = wrapper.get('input');
        expect(input.attributes('aria-expanded')).toBe('false');

        await wrapper.setProps({ modelValue: 'ann' });
        expect(input.attributes('aria-expanded')).toBe('true');
        expect(wrapper.findAll('[data-test="combobox-option"]').map((option) => option.text())).toEqual(['Create "ann"', 'Jane Doe', '12 Elm Street']);
        expect(wrapper.get('[role="presentation"]').text()).toBe('Address suggestions');

        await input.trigger('keydown', { key: 'ArrowDown' });
        await input.trigger('keydown', { key: 'Enter' });
        expect(wrapper.emitted('select')?.[0]).toEqual([options[1]]);

        await wrapper.setProps({ modelValue: 'anna' });
        await wrapper.findAll('[data-test="combobox-option"]')[2]?.trigger('click');
        expect(wrapper.emitted('select')?.[1]).toEqual([options[2]]);
    });

    it('makes the first option `prefer` passes the one Enter takes, and waits while loading', async () => {
        const wrapper = mount(UiCombobox, {
            props: { modelValue: 'ann', options: [], prefer: (option: { key: string }) => option.key === 'ann' },
            slots: { option: '<template #option="{ option }">{{ option.name }}</template>' },
        });
        const input = wrapper.get('input');
        await input.trigger('focusin');

        await wrapper.setProps({ options, loading: true });
        await input.trigger('keydown', { key: 'Enter' });
        expect(wrapper.emitted('select')).toBeUndefined();

        await wrapper.setProps({ loading: false });
        expect(wrapper.findAll('[data-test="combobox-option"]')[1]?.attributes('aria-selected')).toBe('true');
        await input.trigger('keydown', { key: 'Enter' });
        expect(wrapper.emitted('select')?.[0]).toEqual([options[1]]);

        await wrapper.setProps({ options: options.filter((option) => option.key !== 'ann') });
        await input.trigger('focusin');
        await input.trigger('keydown', { key: 'Enter' });
        expect(wrapper.emitted('select')?.[1]).toEqual([options[0]]);
    });

    it('shows its message above the options', async () => {
        const wrapper = mount(UiCombobox, { props: { modelValue: 'an', options: [], label: 'Find a person', message: 'Type at least three characters.' } });
        await wrapper.setProps({ modelValue: 'an ' });

        expect(wrapper.get('[data-test="combobox-message"]').text()).toBe('Type at least three characters.');
        expect(wrapper.findAll('[data-test="combobox-option"]')).toHaveLength(0);
    });
});
