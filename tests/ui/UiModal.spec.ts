import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiModal from '../../src/ui/UiModal.vue';

describe('UiModal', () => {
    it('renders nothing while closed and a labelled dialog with a footer while open', async () => {
        const wrapper = mount(UiModal, { props: { open: false, title: 'Block?', description: 'The user signs out everywhere.' }, slots: { default: 'Sure?', footer: '<button>Yes</button>' }, attachTo: document.body });

        expect(document.querySelector('[role="dialog"]')).toBeNull();

        await wrapper.setProps({ open: true });
        await new Promise((resolve) => setTimeout(resolve, 0));

        const dialog = document.querySelector('[role="dialog"]');
        expect(dialog?.getAttribute('aria-modal')).toBe('true');
        expect(document.getElementById(dialog?.getAttribute('aria-labelledby') ?? '')?.textContent).toBe('Block?');
        expect(document.getElementById(dialog?.getAttribute('aria-describedby') ?? '')?.textContent).toBe('The user signs out everywhere.');
        expect(document.body.textContent).toContain('Sure?');
        expect(document.querySelector('footer button')?.textContent).toBe('Yes');

        wrapper.unmount();
    });

    it('asks to close on Escape and on the close button', async () => {
        const wrapper = mount(UiModal, { props: { open: true, title: 'T' }, attachTo: document.body });
        await new Promise((resolve) => setTimeout(resolve, 0));

        document.querySelector('[role="dialog"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await new Promise((resolve) => setTimeout(resolve, 0));
        (document.querySelector('[role="dialog"] button[aria-label="Close"]') as HTMLButtonElement).click();
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(wrapper.emitted('close')).toHaveLength(2);

        wrapper.unmount();
    });
});
