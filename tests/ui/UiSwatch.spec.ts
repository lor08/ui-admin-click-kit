import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiSwatch from '../../src/ui/UiSwatch.vue';

describe('UiSwatch', () => {
    it('fills the square with the color, borders it with the same color or its own, and writes the word after it', () => {
        const area = mount(UiSwatch, { props: { color: '#2196F3' } });
        const removed = mount(UiSwatch, { props: { color: '#f5f5f5', border: '#F44336', size: 'md' }, slots: { default: 'Removed from the area' } });

        expect(area.get('[data-test="swatch-color"]').attributes('style')).toContain('background-color: rgb(33, 150, 243)');
        expect(area.get('[data-test="swatch-color"]').attributes('style')).toContain('border-color: rgb(33, 150, 243)');
        expect(area.get('[data-test="swatch-color"]').classes()).toContain('h-3');
        expect(area.text()).toBe('');

        expect(removed.get('[data-test="swatch-color"]').attributes('style')).toContain('border-color: rgb(244, 67, 54)');
        expect(removed.get('[data-test="swatch-color"]').classes()).toContain('border-2');
        expect(removed.text()).toBe('Removed from the area');
    });
});
