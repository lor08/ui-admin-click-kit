import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiTextarea from '../../src/ui/UiTextarea.vue';

describe('UiTextarea', () => {
    it('is a labelled multi-line field that emits what is typed', async () => {
        const wrapper = mount(UiTextarea, { props: { label: 'Notes', modelValue: '', rows: 5, error: 'Too long.' } });

        expect(wrapper.get('label').attributes('for')).toBe(wrapper.get('textarea').attributes('id'));
        expect(wrapper.get('textarea').attributes('rows')).toBe('5');
        expect(wrapper.get('textarea').attributes('aria-invalid')).toBe('true');

        await wrapper.get('textarea').setValue('Prefers mornings');

        expect(wrapper.emitted('update:modelValue')).toEqual([['Prefers mornings']]);
    });
});
