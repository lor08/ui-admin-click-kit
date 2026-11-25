import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import UiBreadcrumbs from '../../src/ui/UiBreadcrumbs.vue';
import UiButton from '../../src/ui/UiButton.vue';
import UiPagination from '../../src/ui/UiPagination.vue';
import UiSpinner from '../../src/ui/UiSpinner.vue';
import { configureUiKit, kitPath, linkWithTo, uiKit, useTrans } from '../../src/ui/kit';

/** A link of a host router: it takes `to`, and says it was used. */
const RouterLinkLike = defineComponent({
    props: { to: { type: String, required: true } },
    setup(props, { slots }) {
        return () => h('a', { href: `#router${props.to}`, 'data-router': 'true' }, slots.default?.());
    },
});

const HostLink = defineComponent({
    props: { href: { type: String, required: true } },
    setup(props, { slots }) {
        return () => h('a', { href: props.href, 'data-host-link': 'true' }, slots.default?.());
    },
});

describe('the kit without adapters', () => {
    it('speaks English from its own words and draws plain anchors', () => {
        expect(mount(UiSpinner).attributes('aria-label')).toBe('Loading…');

        const link = mount(UiButton, { props: { href: '/projects' }, slots: { default: 'Projects' } });
        expect(link.element.tagName).toBe('A');
        expect(link.attributes('href')).toBe('/projects');
    });

    it('reads the path of the page from the browser', () => {
        window.history.replaceState(null, '', '/projects/3?tab=files');

        expect(kitPath()).toBe('/projects/3');
    });
});

describe('the kit with adapters', () => {
    afterEach(() => configureUiKit({}));

    it('speaks Russian from its own words when the host gives only the locale', () => {
        const locale = ref('ru');
        configureUiKit({ locale: () => locale.value });

        expect(mount(UiSpinner).attributes('aria-label')).toBe('Загрузка…');
        expect(mount(UiPagination, { props: { page: 1, lastPage: 3 } }).get('nav').attributes('aria-label')).toBe('Страницы');
    });

    it("uses the host's translator for every word", () => {
        configureUiKit({ useTrans: () => (key) => `host:${key}` });

        expect(mount(UiSpinner).attributes('aria-label')).toBe('host:ui.loading');
    });

    it('merges more words over its own for its translator', () => {
        configureUiKit({ words: [{ en: { extra: { hello: 'Hello, :name' } } }] });
        const t = mount(defineComponent({ setup: () => ({ t: useTrans() }), render: () => null })).vm.t;

        expect(t('extra.hello', { name: 'Jane' })).toBe('Hello, Jane');
        expect(t('ui.close')).toBe('Close');
        expect(t('missing.key')).toBe('missing.key');
    });

    it("renders links with the host's link component", () => {
        configureUiKit({ link: HostLink });
        const crumbs = mount(UiBreadcrumbs, { props: { items: [{ label: 'People', href: '/people' }, { label: 'Jane Doe' }] } });

        expect(crumbs.get('a').attributes('data-host-link')).toBe('true');
        expect(crumbs.get('a').attributes('href')).toBe('/people');
    });

    it('adapts a router link that takes `to`', () => {
        configureUiKit({ link: linkWithTo(RouterLinkLike) });
        const button = mount(UiButton, { props: { href: '/projects/1' }, slots: { default: 'Open' } });

        expect(button.attributes('data-router')).toBe('true');
        expect(button.attributes('href')).toBe('#router/projects/1');
        expect(button.classes()).toContain('rounded-control');
        expect(button.text()).toBe('Open');
    });

    it('installs as a Vue plugin and reads the current path without its query', () => {
        mount(defineComponent({ render: () => null }), { global: { plugins: [[uiKit, { currentPath: () => '/projects/7?tab=files#top' }]] } });

        expect(kitPath()).toBe('/projects/7');
    });
});
