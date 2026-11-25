import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiChip from '../../src/ui/UiChip.vue';

describe('UiChip', () => {
    it('is a button that reports a pick and shows whether it is the active one', async () => {
        const wrapper = mount(UiChip, { props: { active: true }, slots: { default: 'Draft' } });

        expect(wrapper.element.tagName).toBe('BUTTON');
        expect(wrapper.attributes('aria-pressed')).toBe('true');
        expect(wrapper.classes()).toContain('bg-brand-600');

        await wrapper.trigger('click');
        expect(wrapper.emitted('select')).toHaveLength(1);
    });

    it("is the app's link with an href and a plain anchor for a hash", () => {
        const link = mount(UiChip, { props: { href: '/ui-kit/buttons', active: true } });
        expect(link.element.tagName).toBe('A');
        expect(link.attributes('href')).toBe('/ui-kit/buttons');
        expect(link.attributes('aria-current')).toBe('page');

        const anchor = mount(UiChip, { props: { href: '#UiTable', mono: true } });
        expect(anchor.attributes('href')).toBe('#UiTable');
        expect(anchor.classes()).toContain('font-mono');
    });
});
