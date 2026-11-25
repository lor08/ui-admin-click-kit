import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiForm from '../../src/ui/UiForm.vue';

describe('UiForm', () => {
    it('emits submit instead of letting the browser post, and disables the actions while processing', async () => {
        const wrapper = mount(UiForm, {
            props: { processing: true, error: 'Something is off.' },
            slots: { default: '<input />', actions: '<button type="submit">Go</button>' },
        });

        await wrapper.get('form').trigger('submit');

        expect(wrapper.emitted('submit')).toHaveLength(1);
        expect(wrapper.get('fieldset').attributes('disabled')).toBeDefined();
        expect(wrapper.get('[data-test="form-error"]').text()).toBe('Something is off.');
    });
});
