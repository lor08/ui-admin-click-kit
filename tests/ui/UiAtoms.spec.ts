import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiDivider from '../../src/ui/UiDivider.vue';
import UiFieldError from '../../src/ui/UiFieldError.vue';
import UiHelpText from '../../src/ui/UiHelpText.vue';
import UiKbd from '../../src/ui/UiKbd.vue';
import UiLabel from '../../src/ui/UiLabel.vue';
import UiSkeleton from '../../src/ui/UiSkeleton.vue';
import UiSpinner from '../../src/ui/UiSpinner.vue';
import UiTooltip from '../../src/ui/UiTooltip.vue';

describe('the small atoms', () => {
    it('UiLabel points at its control and marks required and optional', () => {
        const required = mount(UiLabel, { props: { for: 'x', required: true }, slots: { default: 'Email' } });
        expect(required.attributes('for')).toBe('x');
        expect(required.text()).toContain('*');
        expect(required.get('.sr-only').text()).toBe('(required)');

        expect(mount(UiLabel, { props: { optional: true }, slots: { default: 'Notes' } }).text()).toBe('Notes (optional)');
    });

    it('UiHelpText and UiFieldError carry the id a control is described by; the error renders nothing when empty', () => {
        expect(mount(UiHelpText, { props: { id: 'n' }, slots: { default: 'Ten digits' } }).attributes('id')).toBe('n');
        expect(mount(UiFieldError, { props: { id: 'e', message: 'Required.' } }).attributes('role')).toBe('alert');
        expect(mount(UiFieldError, { props: { message: null } }).html()).toBe('<!--v-if-->');
    });

    it('UiSpinner is a status with the loading label, UiSkeleton is decorative', () => {
        expect(mount(UiSpinner).attributes('aria-label')).toBe('Loading…');
        expect(mount(UiSpinner, { props: { label: 'Searching' } }).attributes('aria-label')).toBe('Searching');

        const skeleton = mount(UiSkeleton, { props: { lines: 3 } });
        expect(skeleton.attributes('aria-hidden')).toBe('true');
        expect(skeleton.findAll('.animate-pulse')).toHaveLength(3);
    });

    it('UiKbd and UiDivider render their element and role', () => {
        expect(mount(UiKbd, { slots: { default: '/' } }).element.tagName).toBe('KBD');
        expect(mount(UiDivider).element.tagName).toBe('HR');
        expect(mount(UiDivider, { props: { vertical: true } }).attributes('aria-orientation')).toBe('vertical');
        expect(mount(UiDivider, { slots: { default: 'or' } }).text()).toBe('or');
    });

    it('UiTooltip shows its text when the trigger is focused', async () => {
        const wrapper = mount(UiTooltip, { props: { text: 'Copy the id' }, slots: { default: '<button>i</button>' }, attachTo: document.body });

        await wrapper.get('button').trigger('focus');
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(document.body.textContent).toContain('Copy the id');
        wrapper.unmount();
    });
});
