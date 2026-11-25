import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import UiPhoneLink from '../../src/ui/UiPhoneLink.vue';
import { configureUiKit } from '../../src/ui/kit';

describe('UiPhoneLink', () => {
    it('is a plain tel: link even when the host gives a link component', () => {
        configureUiKit({ link: { props: ['href'], render: () => h('span', 'router link') } });
        const wrapper = mount(UiPhoneLink, { props: { href: 'tel:+14155550170', title: 'Call' }, slots: { default: '+1 415 555 0170' } });

        expect(wrapper.element.tagName).toBe('A');
        expect(wrapper.attributes('href')).toBe('tel:+14155550170');
        expect(wrapper.attributes('title')).toBe('Call');
        expect(wrapper.text()).toBe('+1 415 555 0170');
    });

    it('hands the click to the page and keeps it and Enter from the row around it', async () => {
        const row = { clicks: 0, keys: 0 };
        const wrapper = mount({
            components: { UiPhoneLink },
            setup: () => ({ row, onLink: (event: MouseEvent) => event.preventDefault() }),
            template: '<div @click="row.clicks++" @keydown.enter="row.keys++"><UiPhoneLink href="tel:+14155550170" @click="onLink">+1 415 555 0170</UiPhoneLink></div>',
        });
        const link = wrapper.getComponent(UiPhoneLink);

        await link.trigger('click');
        await link.trigger('keydown', { key: 'Enter' });
        expect(link.emitted('click')).toHaveLength(1);
        expect((link.emitted('click')?.[0]?.[0] as MouseEvent).defaultPrevented).toBe(true);
        expect(row).toEqual({ clicks: 0, keys: 0 });
    });
});
