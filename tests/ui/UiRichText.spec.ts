import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiRichText from '../../src/ui/UiRichText.vue';

describe('UiRichText', () => {
    it('shows the cleaned marks as they were written, or its empty words', () => {
        const wrapper = mount(UiRichText, { props: { html: '<p><b style="color: #e60000">Do not</b> try</p>' } });
        expect(wrapper.get('[data-test="rich-text"] b').text()).toBe('Do not');
        expect(wrapper.get('[data-test="rich-text"] b').attributes('style')).toContain('color');

        expect(mount(UiRichText, { props: { html: '', empty: 'No message.' } }).text()).toBe('No message.');
    });
});
