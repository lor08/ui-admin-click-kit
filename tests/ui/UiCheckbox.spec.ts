import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiCheckbox from '../../src/ui/UiCheckbox.vue';

describe('UiCheckbox', () => {
    it('is a labelled checkbox with a description that emits its state', async () => {
        const wrapper = mount(UiCheckbox, { props: { modelValue: false, label: 'Primary', description: 'The number we call first' } });

        expect(wrapper.get('label').text()).toContain('Primary');
        expect(wrapper.get('label').text()).toContain('The number we call first');
        expect(wrapper.get('label').attributes('for')).toBe(wrapper.get('input').attributes('id'));
        expect(wrapper.get('input').attributes('aria-describedby')).toBeDefined();

        await wrapper.get('input').setValue(true);

        expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
    });

    it('can stand for a group that is partly checked', () => {
        const wrapper = mount(UiCheckbox, { props: { modelValue: false, label: 'People', indeterminate: true } });
        const input = wrapper.get('input').element as HTMLInputElement;

        expect(input.indeterminate).toBe(true);
        expect(wrapper.get('input').attributes('aria-checked')).toBe('mixed');
        expect(mount(UiCheckbox, { props: { modelValue: true, label: 'projects.view', mono: true } }).find('.font-mono').exists()).toBe(true);
    });

    it('can be disabled and in error', () => {
        const wrapper = mount(UiCheckbox, { props: { modelValue: true, label: 'Terms', disabled: true, error: 'You must accept.' } });

        expect(wrapper.get('input').attributes('disabled')).toBeDefined();
        expect(wrapper.get('input').attributes('aria-invalid')).toBe('true');
        expect(wrapper.get('[data-test="error"]').text()).toBe('You must accept.');
    });
});
