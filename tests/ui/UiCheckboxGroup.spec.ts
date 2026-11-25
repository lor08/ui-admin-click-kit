import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiCheckboxGroup from '../../src/ui/UiCheckboxGroup.vue';

const options = [
    { value: 'admin', label: 'Administrator' },
    { value: 'editor', label: 'Editor' },
    { value: 'sales_qa', label: 'Sales QA', description: 'Reads everything.' },
];

describe('UiCheckboxGroup', () => {
    it('is a fieldset of labelled boxes that emits the picked values in the order of the options', async () => {
        const wrapper = mount(UiCheckboxGroup, { props: { modelValue: ['sales_qa'], options, label: 'Roles' } });

        expect(wrapper.get('legend').text()).toBe('Roles');
        expect(wrapper.findAll('input').map((input) => (input.element as HTMLInputElement).checked)).toEqual([false, false, true]);
        expect(wrapper.text()).toContain('Reads everything.');

        await wrapper.findAll('input')[0]?.setValue(true);
        expect(wrapper.emitted('update:modelValue')).toEqual([[['admin', 'sales_qa']]]);

        await wrapper.setProps({ modelValue: ['admin', 'sales_qa'] });
        await wrapper.findAll('input')[2]?.setValue(false);
        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['admin']]);
    });

    it('carries one error and one hint for the whole group and can be disabled', () => {
        const withError = mount(UiCheckboxGroup, { props: { modelValue: [], options, label: 'Roles', error: 'Pick at least one role.' } });
        expect(withError.get('[data-test="error"]').text()).toBe('Pick at least one role.');
        expect(withError.get('fieldset').attributes('aria-invalid')).toBe('true');

        const disabled = mount(UiCheckboxGroup, { props: { modelValue: [], options, hint: 'Several at once.', disabled: true } });
        expect(disabled.text()).toContain('Several at once.');
        expect(disabled.get('fieldset').attributes('disabled')).toBeDefined();
        expect(disabled.findAll('input').every((input) => input.attributes('disabled') !== undefined)).toBe(true);
    });
});
