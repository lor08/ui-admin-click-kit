import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiIconButton from '../../src/ui/UiIconButton.vue';

describe('UiIconButton', () => {
    it('names itself for assistive tech and the tooltip', () => {
        const wrapper = mount(UiIconButton, { props: { label: 'Edit' }, slots: { default: '<svg />' } });

        expect(wrapper.attributes('aria-label')).toBe('Edit');
        expect(wrapper.attributes('title')).toBe('Edit');
        expect(wrapper.attributes('type')).toBe('button');
        expect(wrapper.find('svg').exists()).toBe(true);
    });

    it('reports a toggle state and can be a link', () => {
        expect(mount(UiIconButton, { props: { label: 'Pin', pressed: true } }).attributes('aria-pressed')).toBe('true');
        expect(mount(UiIconButton, { props: { label: 'Pin', pressed: false } }).attributes('aria-pressed')).toBe('false');
        expect(mount(UiIconButton, { props: { label: 'Pin' } }).attributes('aria-pressed')).toBeUndefined();

        const link = mount(UiIconButton, { props: { label: 'Open', href: '/people/1' } });
        expect(link.element.tagName).toBe('A');
        expect(link.attributes('href')).toBe('/people/1');
    });
});
