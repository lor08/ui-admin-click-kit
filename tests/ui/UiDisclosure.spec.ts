import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiDisclosure from '../../src/ui/UiDisclosure.vue';

describe('UiDisclosure', () => {
    it('is closed by default with the title and the meta in view, and opens on its title', async () => {
        const wrapper = mount(UiDisclosure, {
            props: { title: 'Done by day', lead: 'Last 30 days' },
            slots: { default: '<table data-test="inside" />', meta: '<span data-test="total">6</span>' },
        });
        const trigger = wrapper.get('[data-test="disclosure-trigger"]');

        expect(trigger.text()).toContain('Done by day');
        expect(trigger.text()).toContain('Last 30 days');
        expect(wrapper.get('[data-test="total"]').text()).toBe('6');
        expect(trigger.attributes('aria-expanded')).toBe('false');
        expect(wrapper.find('[data-test="inside"]').exists()).toBe(false);

        await trigger.trigger('click');

        expect(trigger.attributes('aria-expanded')).toBe('true');
        expect(wrapper.find('[data-test="inside"]').exists()).toBe(true);
        expect(wrapper.emitted('update:open')).toEqual([[true]]);
    });

    it('starts open when asked', () => {
        const wrapper = mount(UiDisclosure, { props: { title: 'Done by day', defaultOpen: true }, slots: { default: '<table data-test="inside" />' } });

        expect(wrapper.get('[data-test="disclosure-trigger"]').attributes('aria-expanded')).toBe('true');
        expect(wrapper.find('[data-test="inside"]').exists()).toBe(true);
    });
});
