import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiBadge from '../../src/ui/UiBadge.vue';

describe('UiBadge', () => {
    it('is neutral by default and colored by tone', () => {
        expect(mount(UiBadge, { slots: { default: 'draft' } }).attributes('data-tone')).toBe('neutral');
        expect(mount(UiBadge, { props: { tone: 'success' } }).classes()).toContain('text-success');
        expect(mount(UiBadge, { props: { tone: 'warning' } }).classes()).toContain('text-warning');
        expect(mount(UiBadge, { props: { tone: 'info' } }).classes()).toContain('text-info');
    });

    it('draws a dot, an outline and a small size on request', () => {
        const wrapper = mount(UiBadge, { props: { tone: 'danger', dot: true, outline: true, size: 'sm' }, slots: { default: 'missed' } });

        expect(wrapper.find('span[aria-hidden="true"]').classes()).toContain('bg-danger');
        expect(wrapper.classes()).toContain('border-danger');
        expect(wrapper.classes()).not.toContain('bg-danger-surface');
        expect(wrapper.classes()).toContain('text-[11px]');
    });
});
