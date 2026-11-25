import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiFormField from '../../src/ui/UiFormField.vue';
import UiInput from '../../src/ui/UiInput.vue';

describe('UiInput', () => {
    it('binds the label to the field and emits what is typed', async () => {
        const wrapper = mount(UiInput, { props: { id: 'email', label: 'Email', modelValue: '', type: 'email' } });

        expect(wrapper.get('label').attributes('for')).toBe('email');
        expect(wrapper.get('input').attributes('type')).toBe('email');

        await wrapper.get('input').setValue('a@b.c');

        expect(wrapper.emitted('update:modelValue')).toEqual([['a@b.c']]);
    });

    it('shows the error over the hint, marks the field invalid and describes it by the message', () => {
        const wrapper = mount(UiInput, { props: { label: 'Name', modelValue: '', hint: 'Full name', error: 'The name field is required.' } });

        expect(wrapper.get('[data-test="error"]').text()).toBe('The name field is required.');
        expect(wrapper.text()).not.toContain('Full name');
        expect(wrapper.get('input').attributes('aria-invalid')).toBe('true');
        expect(wrapper.get('input').attributes('aria-describedby')).toBe(wrapper.get('[data-test="error"]').attributes('id'));
    });

    it('describes itself by the hint when there is no error', () => {
        const wrapper = mount(UiInput, { props: { label: 'Name', modelValue: '', hint: 'Full name' } });

        expect(wrapper.get('input').attributes('aria-describedby')).toBe(wrapper.get('[data-test="hint"]').attributes('id'));
    });

    it('is a bare control without a label and takes the ids of a UiFormField around it', () => {
        const bare = mount(UiInput, { props: { modelValue: '', placeholder: 'Search' } });
        expect(bare.find('label').exists()).toBe(false);
        expect(bare.get('input').attributes('placeholder')).toBe('Search');

        const wrapped = mount(UiFormField, {
            props: { label: 'Phone', error: 'Not a number.', id: 'phone' },
            slots: { default: () => [] },
            global: { components: { UiInput } },
        });
        const field = mount({
            components: { UiFormField, UiInput },
            template: '<UiFormField label="Phone" error="Not a number." id="phone"><UiInput model-value="" /></UiFormField>',
        });

        expect(wrapped.get('label').attributes('for')).toBe('phone');
        expect(field.get('input').attributes('id')).toBe('phone');
        expect(field.get('input').attributes('aria-invalid')).toBe('true');
        expect(field.get('input').attributes('aria-describedby')).toBe(field.get('[data-test="error"]').attributes('id'));
    });

    it('marks a required field and renders sizes and leading icons', () => {
        const wrapper = mount(UiInput, { props: { label: 'Email', modelValue: '', required: true, size: 'sm' }, slots: { leading: '<svg data-test="icon" />' } });

        expect(wrapper.get('label').text()).toContain('*');
        expect(wrapper.get('input').attributes('required')).toBeDefined();
        expect(wrapper.get('input').classes()).toContain('h-8');
        expect(wrapper.get('input').classes()).toContain('pl-9');
        expect(wrapper.find('[data-test="icon"]').exists()).toBe(true);
    });
});
