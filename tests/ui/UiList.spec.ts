import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import UiList from '../../src/ui/UiList.vue';
import UiListItem from '../../src/ui/UiListItem.vue';

const Host = defineComponent({
    render: () =>
        h(UiList, { bordered: true, divided: true }, () => [
            h(UiListItem, { title: 'Google', description: 'linked' }, { trailing: () => h('button', 'Unlink') }),
            h(UiListItem, { title: 'projects.view', mono: true }),
        ]),
});

describe('UiList', () => {
    it('is a list of rows with a title, a line under it and the action on the right', () => {
        const wrapper = mount(Host);
        const rows = wrapper.findAll('[data-test="list-item"]');

        expect(wrapper.get('[data-test="list"]').element.tagName).toBe('UL');
        expect(wrapper.get('[data-test="list"]').classes()).toContain('border');
        expect(wrapper.get('[data-test="list"]').classes()).toContain('border-t');
        expect(rows).toHaveLength(2);
        expect(rows[0]?.text()).toContain('Google');
        expect(rows[0]?.text()).toContain('linked');
        expect(rows[0]?.get('button').text()).toBe('Unlink');
        expect(rows[1]?.find('.font-mono').exists()).toBe(true);
    });
});

describe('UiListItem, selectable', () => {
    it('makes the title a button that selects the row and marks the selected one', async () => {
        const plain = mount(UiListItem, { props: { title: 'Google' } });
        const row = mount(UiListItem, { props: { title: 'Area A1, north', selectable: true, selected: false }, slots: { trailing: '<button>Edit</button>' } });

        expect(plain.find('button').exists()).toBe(false);
        expect(plain.attributes('data-selected')).toBeUndefined();

        const pick = row.get('button[aria-pressed]');
        expect(pick.text()).toBe('Area A1, north');
        expect(pick.attributes('aria-pressed')).toBe('false');
        await pick.trigger('click');
        expect(row.emitted('select')).toHaveLength(1);

        await row.setProps({ selected: true });
        expect(row.attributes('data-selected')).toBe('true');
        expect(row.classes()).toContain('bg-brand-50');
        expect(row.get('button[aria-pressed]').attributes('aria-pressed')).toBe('true');

        await row.findAll('button')[1]?.trigger('click');
        expect(row.emitted('select')).toHaveLength(1);
    });
});
