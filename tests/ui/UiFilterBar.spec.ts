import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiFilterBar from '../../src/ui/UiFilterBar.vue';

describe('UiFilterBar', () => {
    it('lays the controls out, applies on submit and resets on the second button', async () => {
        const wrapper = mount(UiFilterBar, { slots: { default: '<input id="a" /><input id="b" />' } });

        expect(wrapper.findAll('input')).toHaveLength(2);
        expect(wrapper.get('[data-test="apply"]').text()).toBe('Show');
        expect(wrapper.get('[data-test="reset"]').text()).toBe('Reset');

        await wrapper.get('form').trigger('submit');
        await wrapper.get('[data-test="reset"]').trigger('click');

        expect(wrapper.emitted('apply')).toHaveLength(1);
        expect(wrapper.emitted('reset')).toHaveLength(1);
    });

    it('can hide the reset, rename the buttons and wait while processing', () => {
        const wrapper = mount(UiFilterBar, { props: { resettable: false, applyLabel: 'Find', processing: true } });

        expect(wrapper.find('[data-test="reset"]').exists()).toBe(false);
        expect(wrapper.get('[data-test="apply"]').text()).toBe('Find');
        expect(wrapper.get('fieldset').attributes('disabled')).toBeDefined();
    });
});
