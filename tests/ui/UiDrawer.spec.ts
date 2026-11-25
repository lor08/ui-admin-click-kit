import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiDrawer from '../../src/ui/UiDrawer.vue';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('UiDrawer', () => {
    it('renders nothing while closed and a labelled modal panel with header actions and a footer while open', async () => {
        const wrapper = mount(UiDrawer, {
            props: { open: false, title: 'Task', description: '+1 555 0100', size: 'lg' },
            slots: { default: 'Call body', actions: '<button>Open the call</button>', footer: '<button>Done</button>' },
            attachTo: document.body,
        });

        expect(document.querySelector('[role="dialog"]')).toBeNull();

        await wrapper.setProps({ open: true });
        await tick();

        const panel = document.querySelector('[role="dialog"]');
        expect(panel?.getAttribute('aria-modal')).toBe('true');
        expect(panel?.getAttribute('data-size')).toBe('lg');
        expect(panel?.className).toContain('sm:max-w-[40rem]');
        expect(document.getElementById(panel?.getAttribute('aria-labelledby') ?? '')?.textContent).toBe('Task');
        expect(document.getElementById(panel?.getAttribute('aria-describedby') ?? '')?.textContent).toBe('+1 555 0100');
        expect(panel?.textContent).toContain('Call body');
        expect([...(panel?.querySelectorAll('[data-test="drawer-actions"] button') ?? [])].map((button) => button.getAttribute('aria-label') ?? button.textContent)).toEqual(['Open the call', 'Close']);
        expect(panel?.querySelector('footer button')?.textContent).toBe('Done');

        wrapper.unmount();
    });

    it('moves the focus inside and asks to close on Escape, the close button and the backdrop', async () => {
        const wrapper = mount(UiDrawer, { props: { open: true, title: 'T' }, attachTo: document.body });
        await tick();

        const panel = document.querySelector('[role="dialog"]');
        expect(panel?.contains(document.activeElement)).toBe(true);

        panel?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await tick();
        (document.querySelector('[role="dialog"] button[aria-label="Close"]') as HTMLButtonElement).click();
        await tick();

        expect(wrapper.emitted('update:open')).toEqual([[false], [false]]);

        document.querySelector('[data-test="backdrop"]')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        await tick();

        expect(wrapper.emitted('update:open')).toEqual([[false], [false], [false]]);

        wrapper.unmount();
    });

    it('takes the full width of a phone and the md width from sm up by default', async () => {
        const wrapper = mount(UiDrawer, { props: { open: true, title: 'T' }, attachTo: document.body });
        await tick();

        const classes = document.querySelector('[role="dialog"]')?.className ?? '';
        expect(classes).toContain('w-full');
        expect(classes).toContain('sm:max-w-md');
        expect(document.querySelector('[role="dialog"] footer')).toBeNull();

        wrapper.unmount();
    });
});
