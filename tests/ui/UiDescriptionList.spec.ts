import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiDescriptionList from '../../src/ui/UiDescriptionList.vue';

describe('UiDescriptionList', () => {
    it('prints a caption and a value per line, the placeholder for an empty one and a slot for a drawn one', () => {
        const wrapper = mount(UiDescriptionList, {
            props: {
                items: [
                    { key: 'name', label: 'Name', value: 'Jane Doe' },
                    { key: 'last_sign_in', label: 'Last sign-in', value: null },
                    { key: 'status', label: 'Status' },
                ],
                placeholder: 'never',
            },
            slots: { 'value-status': '<template #value-status="{ item }"><b>{{ item.key }}</b></template>' },
        });

        expect(wrapper.findAll('dt').map((dt) => dt.text())).toEqual(['Name', 'Last sign-in', 'Status']);
        expect(wrapper.get('[data-test="item-name"] dd').text()).toBe('Jane Doe');
        expect(wrapper.get('[data-test="item-last_sign_in"] dd').text()).toBe('never');
        expect(wrapper.get('[data-test="item-status"] b').text()).toBe('status');
    });
});
