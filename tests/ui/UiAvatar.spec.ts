import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiAvatar from '../../src/ui/UiAvatar.vue';

describe('UiAvatar', () => {
    it('shows the initials of the first and the last name, and names the person for assistive tech', () => {
        const wrapper = mount(UiAvatar, { props: { name: 'Jane Marie Doe' } });

        expect(wrapper.get('[aria-hidden="true"]').text()).toBe('JD');
        expect(wrapper.get('.sr-only').text()).toBe('Jane Marie Doe');
        expect(wrapper.attributes('title')).toBe('Jane Marie Doe');
    });

    it('takes two letters of a single name, a question mark of none, and a picture when given one', () => {
        expect(mount(UiAvatar, { props: { name: 'admin' } }).get('[aria-hidden="true"]').text()).toBe('AD');
        expect(mount(UiAvatar, { props: { name: '  ' } }).get('[aria-hidden="true"]').text()).toBe('?');

        const picture = mount(UiAvatar, { props: { name: 'Jane', src: '/a.png', size: 'lg' } });
        expect(picture.get('img').attributes('alt')).toBe('Jane');
        expect(picture.classes()).toContain('h-12');
    });
});
