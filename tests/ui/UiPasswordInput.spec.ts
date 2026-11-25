import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiPasswordInput from '../../src/ui/UiPasswordInput.vue';

describe('UiPasswordInput', () => {
    it('is a labelled password control whose eye reveals the text', async () => {
        const wrapper = mount(UiPasswordInput, { props: { modelValue: 'secret', label: 'Password', id: 'password' } });
        const input = wrapper.get('input');

        expect(wrapper.get('label').attributes('for')).toBe('password');
        expect(input.attributes('type')).toBe('password');
        expect(wrapper.get('[data-test="reveal"]').attributes('aria-label')).toBe('Show the password');
        expect(wrapper.find('[data-test="strength"]').exists()).toBe(false);

        await wrapper.get('[data-test="reveal"]').trigger('click');
        expect(input.attributes('type')).toBe('text');
        expect(wrapper.get('[data-test="reveal"]').attributes('aria-label')).toBe('Hide the password');

        await input.setValue('secret!');
        expect(wrapper.emitted('update:modelValue')).toEqual([['secret!']]);
    });

    it('judges the strength by the length rule of the application and the variety of characters', async () => {
        const wrapper = mount(UiPasswordInput, { props: { modelValue: '', label: 'New password', strength: true, minLength: 12 } });
        expect(wrapper.find('[data-test="strength"]').exists()).toBe(false);

        await wrapper.setProps({ modelValue: 'short' });
        expect(wrapper.get('[data-test="strength-word"]').text()).toBe('Weak');
        expect(wrapper.get('[data-test="check-length"]').text()).toBe('At least 12 characters');
        expect(wrapper.get('[data-test="check-length"]').attributes('data-passes')).toBe('false');
        expect(wrapper.get('[data-test="check-lower"]').attributes('data-passes')).toBe('true');

        await wrapper.setProps({ modelValue: 'correct horse 9' });
        expect(wrapper.get('[data-test="strength-word"]').text()).toBe('Medium');
        expect(wrapper.get('[data-test="check-length"]').attributes('data-passes')).toBe('true');
        expect(wrapper.get('[data-test="check-special"]').attributes('data-passes')).toBe('false');

        await wrapper.setProps({ modelValue: 'Correct-horse-9' });
        expect(wrapper.get('[data-test="strength-word"]').text()).toBe('Strong');
        expect(wrapper.get('[role="meter"]').attributes('aria-valuenow')).toBe('5');
    });

    it('shows the error of the field and marks the control', () => {
        const wrapper = mount(UiPasswordInput, { props: { modelValue: '', label: 'Password', error: 'The password field is required.' } });

        expect(wrapper.get('[data-test="error"]').text()).toBe('The password field is required.');
        expect(wrapper.get('input').attributes('aria-invalid')).toBe('true');
    });
});
