import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiButton from '../../src/ui/UiButton.vue';

describe('UiButton', () => {
    it('is a primary button by default', () => {
        const wrapper = mount(UiButton, { slots: { default: 'Save' } });

        expect(wrapper.element.tagName).toBe('BUTTON');
        expect(wrapper.attributes('type')).toBe('button');
        expect(wrapper.classes()).toContain('bg-brand-600');
        expect(wrapper.text()).toBe('Save');
    });

    it("is the app's link when given an href", () => {
        const wrapper = mount(UiButton, { props: { href: '/users', variant: 'secondary' } });

        expect(wrapper.element.tagName).toBe('A');
        expect(wrapper.attributes('href')).toBe('/users');
        expect(wrapper.classes()).toContain('border-line');
    });

    it("is a plain download link for a file, which the app's router must not fetch", () => {
        const wrapper = mount(UiButton, { props: { href: '/exports/tasks.csv', download: true }, slots: { default: 'Download' } });

        expect(wrapper.element.tagName).toBe('A');
        expect(wrapper.attributes('href')).toBe('/exports/tasks.csv');
        expect(wrapper.attributes('download')).toBeDefined();
        expect(wrapper.text()).toBe('Download');
    });

    it("opens a page in a new tab as a plain link, outside the app's router", () => {
        const wrapper = mount(UiButton, { props: { href: '/projects/01HX/tasks', newTab: true, variant: 'link' }, slots: { default: 'PRJ-0001' } });

        expect(wrapper.element.tagName).toBe('A');
        expect(wrapper.attributes('href')).toBe('/projects/01HX/tasks');
        expect(wrapper.attributes('target')).toBe('_blank');
        expect(wrapper.attributes('rel')).toBe('noopener');
        expect(wrapper.attributes('download')).toBeUndefined();
    });

    it('can be disabled, dangerous, small and full width', () => {
        const wrapper = mount(UiButton, { props: { disabled: true, variant: 'danger', size: 'sm', block: true } });

        expect(wrapper.attributes('disabled')).toBeDefined();
        expect(wrapper.classes()).toContain('bg-danger');
        expect(wrapper.classes()).toContain('text-xs');
        expect(wrapper.classes()).toContain('w-full');
    });

    it('shows a spinner instead of the icon and blocks clicks while loading', () => {
        const wrapper = mount(UiButton, { props: { loading: true }, slots: { icon: '<i data-test="icon" />', default: 'Send' } });

        expect(wrapper.attributes('disabled')).toBeDefined();
        expect(wrapper.attributes('aria-busy')).toBe('true');
        expect(wrapper.find('[role="status"]').exists()).toBe(true);
        expect(wrapper.find('[data-test="icon"]').exists()).toBe(false);
        expect(wrapper.text()).toBe('Send');
    });

    it('renders ghost and link variants without a background', () => {
        expect(mount(UiButton, { props: { variant: 'ghost' } }).classes()).toContain('text-brand-600');
        expect(mount(UiButton, { props: { variant: 'link' } }).classes()).toContain('hover:underline');
    });
});
