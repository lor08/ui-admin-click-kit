import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { h, nextTick, ref } from 'vue';
import UiAppShell from '../../src/ui/UiAppShell.vue';
import UiAudioPlayer from '../../src/ui/UiAudioPlayer.vue';
import UiAuthFrame from '../../src/ui/UiAuthFrame.vue';
import UiNavItem from '../../src/ui/UiNavItem.vue';
import UiSidebarIdentity from '../../src/ui/UiSidebarIdentity.vue';
import UiSidebarSelect from '../../src/ui/UiSidebarSelect.vue';
import { configureUiKit } from '../../src/ui/kit';

const Icon = { render: () => h('svg') };

afterEach(() => {
    document.body.innerHTML = '';
});

describe('UiNavItem', () => {
    it('is the current line while the path is its prefix or lies under it', () => {
        const path = ref('/projects/7');
        configureUiKit({ currentPath: () => path.value });

        const projects = mount(UiNavItem, { props: { label: 'Projects', icon: Icon, href: '/projects', activePrefix: '/projects' } });
        const people = mount(UiNavItem, { props: { label: 'People', icon: Icon, href: '/people', activePrefix: '/people' } });
        const prefixOnly = mount(UiNavItem, { props: { label: 'Pro', icon: Icon, href: '/pro', activePrefix: '/pro' } });

        expect(projects.element.tagName).toBe('A');
        expect(projects.attributes('href')).toBe('/projects');
        expect(projects.attributes('aria-current')).toBe('page');
        expect(people.attributes('aria-current')).toBeUndefined();
        expect(prefixOnly.attributes('aria-current')).toBeUndefined();
        expect(projects.text()).toBe('Projects');
    });

    it('is a button that emits click without href', async () => {
        const wrapper = mount(UiNavItem, { props: { label: 'Sign out', icon: Icon } });

        expect(wrapper.element.tagName).toBe('BUTTON');
        await wrapper.trigger('click');
        expect(wrapper.emitted('click')).toHaveLength(1);
    });
});

describe('UiAppShell', () => {
    it('draws the brand, the menu and the page, opens the phone drawer and closes it when the path changes', async () => {
        const path = ref('/projects');
        configureUiKit({ currentPath: () => path.value });
        const wrapper = mount(UiAppShell, {
            props: { brand: 'Acme Admin' },
            slots: { default: '<p data-test="page">page</p>', nav: '<a href="/projects">Projects</a>', footer: '<span data-test="who">Jane Doe</span>' },
            attachTo: document.body,
        });

        expect(wrapper.get('[data-test="brand"]').text()).toBe('Acme Admin');
        expect(wrapper.get('[data-test="desktop-sidebar"] nav').attributes('aria-label')).toBe('Sections');
        expect(wrapper.get('[data-test="page"]').text()).toBe('page');
        expect(document.querySelector('[data-test="mobile-sidebar"]')).toBeNull();

        await wrapper.get('[data-test="sidebar-toggle"]').trigger('click');
        await flushPromises();
        expect(wrapper.get('[data-test="sidebar-toggle"]').attributes('aria-label')).toBe('Open the menu');
        expect(document.querySelector('[data-test="mobile-sidebar"]')).not.toBeNull();

        path.value = '/people';
        await nextTick();
        await flushPromises();
        expect(document.querySelector('[data-test="mobile-sidebar"]')).toBeNull();
        wrapper.unmount();
    });
});

describe('the sidebar parts', () => {
    it('says who is signed in and lets the language be chosen', async () => {
        const identity = mount(UiSidebarIdentity, { props: { name: 'Jane Doe', caption: 'Administrator' } });
        expect(identity.get('[data-test="identity-name"]').text()).toBe('Jane Doe');
        expect(identity.get('[data-test="identity-caption"]').text()).toBe('Administrator');

        const select = mount(UiSidebarSelect, { props: { modelValue: 'en', label: 'Language', options: [{ value: 'en', label: 'English' }, { value: 'ru', label: 'Русский' }] } });
        expect(select.get('select').attributes('aria-label')).toBe('Language');
        await select.get('select').setValue('ru');
        expect(select.emitted('update:modelValue')?.[0]).toEqual(['ru']);
    });
});

describe('UiAuthFrame', () => {
    it('puts the brand above one card with the title, the lead and the footer under it', () => {
        const wrapper = mount(UiAuthFrame, { props: { brand: 'Acme Admin', title: 'Sign in', lead: 'Use your account.' }, slots: { default: '<form data-test="form" />', footer: '<a href="/help">Help</a>' } });

        expect(wrapper.get('[data-test="app-name"]').text()).toBe('Acme Admin');
        expect(wrapper.text()).toContain('Sign in');
        expect(wrapper.text()).toContain('Use your account.');
        expect(wrapper.find('[data-test="form"]').exists()).toBe(true);
        expect(wrapper.get('a').attributes('href')).toBe('/help');
    });
});

describe('UiAudioPlayer', () => {
    it('loads nothing before play, names itself and tells the page of a play and a failure', async () => {
        const wrapper = mount(UiAudioPlayer, { props: { src: '/recordings/1.mp3', label: 'Recording of the meeting' } });
        const audio = wrapper.get('[data-test="audio"]');

        expect(audio.attributes('src')).toBe('/recordings/1.mp3');
        expect(audio.attributes('preload')).toBe('none');
        expect(audio.attributes('aria-label')).toBe('Recording of the meeting');
        expect(wrapper.vm.element).toBe(audio.element);

        await audio.trigger('play');
        await audio.trigger('error');
        expect(wrapper.emitted('play')).toHaveLength(1);
        expect(wrapper.emitted('error')).toHaveLength(1);
    });
});
