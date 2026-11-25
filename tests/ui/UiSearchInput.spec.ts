import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiSearchInput from '../../src/ui/UiSearchInput.vue';

describe('UiSearchInput', () => {
    it('binds at once, searches after a pause, and on Enter without waiting', async () => {
        vi.useFakeTimers();
        const wrapper = mount(UiSearchInput, { props: { modelValue: '', placeholder: 'Phone or name' } });

        expect(wrapper.get('input').attributes('type')).toBe('search');
        expect(wrapper.get('input').attributes('aria-label')).toBe('Phone or name');

        await wrapper.get('input').setValue('an');
        expect(wrapper.emitted('update:modelValue')).toEqual([['an']]);

        await wrapper.setProps({ modelValue: 'an' });
        expect(wrapper.emitted('search')).toBeUndefined();
        vi.advanceTimersByTime(300);
        expect(wrapper.emitted('search')).toEqual([['an']]);

        await wrapper.setProps({ modelValue: 'ann ' });
        await wrapper.get('input').trigger('keydown', { key: 'Enter' });
        expect(wrapper.emitted('search')).toEqual([['an'], ['ann']]);
        vi.advanceTimersByTime(300);
        expect(wrapper.emitted('search')).toHaveLength(2);

        vi.useRealTimers();
    });

    it('clears on the cross and on Escape, and shows a spinner instead of the cross while loading', async () => {
        const wrapper = mount(UiSearchInput, { props: { modelValue: 'ann' } });

        await wrapper.get('[data-test="clear"]').trigger('click');
        await wrapper.get('input').trigger('keydown', { key: 'Escape' });

        expect(wrapper.emitted('update:modelValue')).toEqual([[''], ['']]);
        expect(wrapper.emitted('clear')).toHaveLength(2);

        await wrapper.setProps({ loading: true });
        expect(wrapper.find('[data-test="clear"]').exists()).toBe(false);
        expect(wrapper.find('[role="status"]').exists()).toBe(true);
    });
});
