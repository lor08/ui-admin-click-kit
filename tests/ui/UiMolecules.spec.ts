import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiAlert from '../../src/ui/UiAlert.vue';
import UiBreadcrumbs from '../../src/ui/UiBreadcrumbs.vue';
import UiCard from '../../src/ui/UiCard.vue';
import UiEmptyState from '../../src/ui/UiEmptyState.vue';
import UiPageHeader from '../../src/ui/UiPageHeader.vue';
import UiStatCard from '../../src/ui/UiStatCard.vue';
import UiTabPanel from '../../src/ui/UiTabPanel.vue';
import UiTabs from '../../src/ui/UiTabs.vue';

describe('UiCard', () => {
    it('shows the heading, the actions and the footer around the content', () => {
        const wrapper = mount(UiCard, { props: { title: 'Contacts', lead: 'How to reach them' }, slots: { default: '<p>body</p>', actions: '<button>Add</button>', footer: 'foot' } });

        expect(wrapper.get('h2').text()).toBe('Contacts');
        expect(wrapper.text()).toContain('How to reach them');
        expect(wrapper.get('header button').text()).toBe('Add');
        expect(wrapper.get('footer').text()).toBe('foot');
    });

    it('drops its padding for a table that fills it', () => {
        expect(mount(UiCard, { props: { padding: 'none' }, slots: { default: '<table />' } }).get('section > div').classes()).not.toContain('p-5');
        expect(mount(UiCard, { slots: { default: 'x' } }).get('section > div').classes()).toContain('p-5');
    });
});

describe('UiAlert', () => {
    it('is a status, or an alert when dangerous, with a title and a dismiss button on request', async () => {
        const wrapper = mount(UiAlert, { props: { variant: 'danger', title: 'Not found', dismissible: true }, slots: { default: 'No such project.' } });

        expect(wrapper.attributes('role')).toBe('alert');
        expect(wrapper.get('p').text()).toBe('Not found');
        expect(wrapper.text()).toContain('No such project.');

        await wrapper.get('button[aria-label="Dismiss"]').trigger('click');
        expect(wrapper.emitted('dismiss')).toHaveLength(1);

        expect(mount(UiAlert, { props: { variant: 'success' } }).attributes('role')).toBe('status');
        expect(mount(UiAlert).find('button').exists()).toBe(false);
    });
});

describe('UiBreadcrumbs and UiPageHeader', () => {
    it('links every crumb but the last, which is the current page', () => {
        const wrapper = mount(UiBreadcrumbs, { props: { items: [{ label: 'People', href: '/people' }, { label: 'Jane Doe', href: '/people/1' }, { label: 'Merge' }] } });

        expect(wrapper.attributes('aria-label')).toBe('You are here');
        expect(wrapper.findAll('a').map((a) => a.attributes('href'))).toEqual(['/people', '/people/1']);
        expect(wrapper.get('[aria-current="page"]').text()).toBe('Merge');
    });

    it('puts the title, the lead, the crumbs and the actions at the top of a page', () => {
        const wrapper = mount(UiPageHeader, {
            props: { title: 'Jane Doe', lead: 'Member since May', breadcrumbs: [{ label: 'People', href: '/people' }, { label: 'Jane Doe' }] },
            slots: { actions: '<button>Offer</button>', meta: '<span>id-1</span>' },
        });

        expect(wrapper.get('h1').text()).toBe('Jane Doe');
        expect(wrapper.text()).toContain('Member since May');
        expect(wrapper.get('[data-test="breadcrumbs"] a').attributes('href')).toBe('/people');
        expect(wrapper.get('[data-test="actions"] button').text()).toBe('Offer');
        expect(wrapper.text()).toContain('id-1');
    });
});

describe('UiEmptyState and UiStatCard', () => {
    it('names what is missing and offers the one thing to do', () => {
        const wrapper = mount(UiEmptyState, { props: { title: 'No calls yet', description: 'They appear as they come in.' }, slots: { action: '<button>Add number</button>' } });

        expect(wrapper.text()).toContain('No calls yet');
        expect(wrapper.text()).toContain('They appear as they come in.');
        expect(wrapper.get('button').text()).toBe('Add number');
        expect(wrapper.find('svg').exists()).toBe(true);
    });

    it('is a card with a number, or a chip that links to the list behind it', () => {
        const card = mount(UiStatCard, { props: { label: 'Active members', value: 128, hint: 'as of today', tone: 'success' } });
        expect(card.element.tagName).toBe('DIV');
        expect(card.get('[data-test="value"]').text()).toBe('128');
        expect(card.get('[data-test="value"]').classes()).toContain('text-success');
        expect(card.text()).toContain('as of today');

        const chip = mount(UiStatCard, { props: { label: 'Missed', value: 3, tone: 'danger', compact: true, href: '/tasks?status=overdue' } });
        expect(chip.element.tagName).toBe('A');
        expect(chip.attributes('href')).toBe('/tasks?status=overdue');
        expect(chip.classes()).toContain('rounded-full');
        expect(chip.get('[data-test="value"]').text()).toBe('3');

        expect(mount(UiStatCard, { props: { label: 'x', value: null } }).get('[data-test="value"]').text()).toBe('—');
        expect(mount(UiStatCard, { props: { label: 'x', value: 1, loading: true } }).find('[data-test="skeleton"]').exists()).toBe(true);
    });
});

describe('UiTabs', () => {
    it('shows the active panel and switches on click', async () => {
        const wrapper = mount(
            {
                components: { UiTabs, UiTabPanel },
                data: () => ({ tab: 'contacts' }),
                template: `
                    <UiTabs v-model="tab" :tabs="[{ value: 'contacts', label: 'Contacts', count: 2 }, { value: 'addresses', label: 'Addresses' }]">
                        <UiTabPanel value="contacts">phones</UiTabPanel>
                        <UiTabPanel value="addresses">streets</UiTabPanel>
                    </UiTabs>`,
            },
            { attachTo: document.body },
        );

        expect(wrapper.findAll('[role="tab"]').map((tab) => tab.text())).toEqual(['Contacts 2', 'Addresses']);
        expect(wrapper.get('[role="tab"][aria-selected="true"]').text()).toContain('Contacts');
        expect(wrapper.text()).toContain('phones');
        expect(wrapper.text()).not.toContain('streets');

        await wrapper.findAll('[role="tab"]')[1]?.trigger('mousedown', { button: 0 });
        await wrapper.findAll('[role="tab"]')[1]?.trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.get('[role="tab"][aria-selected="true"]').text()).toBe('Addresses');
        expect(wrapper.text()).toContain('streets');
        wrapper.unmount();
    });
});
