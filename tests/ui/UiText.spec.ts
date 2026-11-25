import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiText from '../../src/ui/UiText.vue';

describe('UiText', () => {
    it('is muted small text inline by default, subtle or mono or a line of its own on request', () => {
        const plain = mount(UiText, { slots: { default: 'never' } });
        expect(plain.element.tagName).toBe('SPAN');
        expect(plain.classes()).toEqual(expect.arrayContaining(['text-ink-muted', 'text-sm']));

        const code = mount(UiText, { props: { tone: 'subtle', mono: true, size: 'xs', block: true }, slots: { default: 'projects.view' } });
        expect(code.element.tagName).toBe('P');
        expect(code.classes()).toEqual(expect.arrayContaining(['text-ink-subtle', 'text-xs', 'font-mono', '[overflow-wrap:anywhere]']));
        expect(code.text()).toBe('projects.view');
    });
});
