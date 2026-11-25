import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiMultiSelect from '../../src/ui/UiMultiSelect.vue';

// jsdom has no layout, so no scrollIntoView; the listbox calls it on the option it highlights.
Element.prototype.scrollIntoView = () => undefined;

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

const owners = [
    { value: 'a1', label: 'Jane Doe' },
    { value: 'a2', label: 'John Roe' },
    { value: 'a3', label: 'Alex Poe' },
    { value: 'a4', label: 'Sam Lee', disabled: true },
];

const options = () => [...document.querySelectorAll<HTMLElement>('[role="option"]')];

async function openList(wrapper: ReturnType<typeof mount>): Promise<void> {
    await wrapper.get('[data-test="multi-select-trigger"]').trigger('click');
    await tick();
}

describe('UiMultiSelect', () => {
    it('says the placeholder while nothing is picked, then the first two labels and how many more', async () => {
        const wrapper = mount(UiMultiSelect, { props: { modelValue: [], options: owners, label: 'Owner', placeholder: 'All owners' } });
        const trigger = () => wrapper.get('[data-test="multi-select-trigger"]');

        expect(trigger().text()).toBe('All owners');
        expect(trigger().attributes('aria-label')).toBe('Owner: All owners');
        expect(wrapper.get('label').attributes('for')).toBe(trigger().attributes('id'));

        await wrapper.setProps({ modelValue: ['a3', 'a1'] });
        expect(trigger().text()).toBe('Jane Doe, Alex Poe');

        await wrapper.setProps({ modelValue: ['a1', 'a2', 'a3', 'a4'] });
        expect(trigger().text()).toBe('Jane Doe, John Roe +2');
        expect(trigger().attributes('aria-label')).toBe('Owner: Jane Doe, John Roe +2');

        expect(mount(UiMultiSelect, { props: { modelValue: [], options: owners } }).get('[data-test="multi-select-trigger"]').text()).toBe('Any');
    });

    it('opens a multi-selectable list with the picked options checked, and toggles an option on click in the order of the options', async () => {
        const wrapper = mount(UiMultiSelect, { props: { modelValue: ['a3'], options: owners, label: 'Owner' }, attachTo: document.body });
        await openList(wrapper);

        expect(wrapper.get('[data-test="multi-select-trigger"]').attributes('aria-expanded')).toBe('true');
        expect(document.querySelector('[role="listbox"]')?.getAttribute('aria-multiselectable')).toBe('true');
        expect(options().map((option) => [option.textContent?.trim(), option.getAttribute('aria-selected')])).toEqual([
            ['Jane Doe', 'false'],
            ['John Roe', 'false'],
            ['Alex Poe', 'true'],
            ['Sam Lee', 'false'],
        ]);
        expect(options()[3]?.hasAttribute('data-disabled')).toBe(true);

        options()[0]?.click();
        await tick();

        expect(wrapper.emitted('update:modelValue')).toEqual([[['a1', 'a3']]]);

        wrapper.unmount();
    });

    it('picks with the keyboard: the list highlights the first option, arrows move, Enter toggles, Escape closes', async () => {
        const wrapper = mount(UiMultiSelect, { props: { modelValue: [], options: owners }, attachTo: document.body });
        await openList(wrapper);

        const list = document.querySelector<HTMLElement>('[role="listbox"]')!;
        list.focus();
        await tick();
        expect(document.querySelector('[data-highlighted]')?.textContent?.trim()).toBe('Jane Doe');

        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await tick();
        expect(document.querySelector('[data-highlighted]')?.textContent?.trim()).toBe('John Roe');

        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        await tick();
        expect(wrapper.emitted('update:modelValue')).toEqual([[['a2']]]);

        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await tick();
        expect(document.querySelector('[role="listbox"]')).toBeNull();

        wrapper.unmount();
    });

    it('filters the list when searchable and says when nothing matches', async () => {
        const wrapper = mount(UiMultiSelect, { props: { modelValue: [], options: owners, searchable: true }, attachTo: document.body });
        await openList(wrapper);

        const filter = document.querySelector<HTMLInputElement>('[data-test="multi-select-filter"]');
        expect(filter?.getAttribute('aria-label')).toBe('Filter the list');
        expect(document.activeElement).toBe(filter);

        filter!.value = 'po';
        filter!.dispatchEvent(new Event('input'));
        await tick();
        expect(options().map((option) => option.textContent?.trim())).toEqual(['Alex Poe']);

        filter!.value = 'zz';
        filter!.dispatchEvent(new Event('input'));
        await tick();
        expect(options()).toHaveLength(0);
        expect(document.querySelector('[data-test="multi-select-none"]')?.textContent).toBe('Nothing matches.');

        wrapper.unmount();
    });

    it('clears every pick from inside the list, and offers Clear only when something is picked', async () => {
        const wrapper = mount(UiMultiSelect, { props: { modelValue: ['a1', 'a2'], options: owners }, attachTo: document.body });
        await openList(wrapper);

        document.querySelector<HTMLButtonElement>('[data-test="multi-select-clear"]')?.click();
        await tick();
        expect(wrapper.emitted('update:modelValue')).toEqual([[[]]]);

        await wrapper.setProps({ modelValue: [] });
        expect(document.querySelector('[data-test="multi-select-clear"]')).toBeNull();

        wrapper.unmount();
    });

    it('carries the error of its field to the trigger and stays shut when disabled', async () => {
        const wrapper = mount(UiMultiSelect, { props: { modelValue: [], options: owners, label: 'Owner', error: 'Pick an owner.', disabled: true } });
        const trigger = wrapper.get('[data-test="multi-select-trigger"]');

        expect(trigger.attributes('aria-invalid')).toBe('true');
        expect(wrapper.get(`#${trigger.attributes('aria-describedby')}`).text()).toBe('Pick an owner.');
        expect(trigger.attributes('disabled')).toBeDefined();
    });
});
