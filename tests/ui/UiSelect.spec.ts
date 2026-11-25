import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiSelect from '../../src/ui/UiSelect.vue';

describe('UiSelect', () => {
    it('lists the options after the placeholder and emits the chosen value', async () => {
        const wrapper = mount(UiSelect, {
            props: {
                label: 'Zone',
                modelValue: '',
                placeholder: 'No team',
                options: [
                    { value: '1', label: 'North' },
                    { value: '2', label: 'South', disabled: true },
                ],
            },
        });

        expect(wrapper.findAll('option').map((option) => option.text())).toEqual(['No team', 'North', 'South']);
        expect(wrapper.findAll('option')[2]?.attributes('disabled')).toBeDefined();
        expect(wrapper.get('label').attributes('for')).toBe(wrapper.get('select').attributes('id'));

        await wrapper.get('select').setValue('1');

        expect(wrapper.emitted('update:modelValue')).toEqual([['1']]);
    });

    it('shows an error and marks the control invalid', () => {
        const wrapper = mount(UiSelect, { props: { label: 'Zone', modelValue: '', options: [], error: 'Pick one.' } });

        expect(wrapper.get('[data-test="error"]').text()).toBe('Pick one.');
        expect(wrapper.get('select').attributes('aria-invalid')).toBe('true');
    });
});
