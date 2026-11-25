import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiSwitch from '../../src/ui/UiSwitch.vue';

describe('UiSwitch', () => {
    it('is a switch that toggles on click of the control or the label', async () => {
        const wrapper = mount(UiSwitch, { props: { modelValue: false, label: 'Auto-renew', description: 'Charge the card at the end of the period' } });
        const control = wrapper.get('[role="switch"]');

        expect(control.attributes('aria-checked')).toBe('false');
        expect(document.getElementById(control.attributes('aria-labelledby') ?? '') ?? wrapper.find(`#${control.attributes('aria-labelledby')}`).exists()).toBeTruthy();

        await control.trigger('click');
        await wrapper.get(`#${control.attributes('aria-labelledby')}`).trigger('click');

        expect(wrapper.emitted('update:modelValue')).toEqual([[true], [true]]);
    });

    it('does nothing while disabled', async () => {
        const wrapper = mount(UiSwitch, { props: { modelValue: true, label: 'On', disabled: true } });

        expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('true');
        await wrapper.get('[role="switch"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });
});
