import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiTabNav from '../../src/ui/UiTabNav.vue';

describe('UiTabNav', () => {
    it('links every tab, marks the current one and shows a figure only where there is one', () => {
        const wrapper = mount(UiTabNav, {
            props: {
                label: 'Project sections',
                current: 'tasks',
                items: [
                    { key: 'overview', label: 'Overview', href: '/projects/1', count: 2 },
                    { key: 'tasks', label: 'Tasks', href: '/projects/1/tasks', count: 0 },
                    { key: 'files', label: 'Files', href: '/projects/1/files', count: null },
                ],
            },
        });

        expect(wrapper.get('nav').attributes('aria-label')).toBe('Project sections');
        const links = wrapper.findAll('a');
        expect(links.map((link) => link.attributes('href'))).toEqual(['/projects/1', '/projects/1/tasks', '/projects/1/files']);
        expect(links.map((link) => link.attributes('aria-current') ?? '')).toEqual(['', 'page', '']);
        expect(links.map((link) => link.text())).toEqual(['Overview2', 'Tasks0', 'Files']);
    });
});
