import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiConfirmDialog from '../../src/ui/UiConfirmDialog.vue';

describe('UiConfirmDialog', () => {
    it('asks the question with the kit buttons and reports the answer', async () => {
        const wrapper = mount(UiConfirmDialog, { props: { open: true, title: 'Merge projects?', message: 'Tasks move to this project.', tone: 'danger' }, attachTo: document.body });
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(document.body.textContent).toContain('Tasks move to this project.');
        const confirm = document.querySelector('[data-test="confirm"]') as HTMLButtonElement;
        const cancel = document.querySelector('[data-test="cancel"]') as HTMLButtonElement;
        expect(confirm.textContent?.trim()).toBe('Confirm');
        expect(cancel.textContent?.trim()).toBe('Cancel');
        expect(confirm.className).toContain('bg-danger');

        confirm.click();
        cancel.click();

        expect(wrapper.emitted('confirm')).toHaveLength(1);
        expect(wrapper.emitted('cancel')).toHaveLength(1);

        wrapper.unmount();
    });

    it('takes custom labels and waits while processing', async () => {
        const wrapper = mount(UiConfirmDialog, { props: { open: true, title: 'T', confirmLabel: 'Merge', cancelLabel: 'Keep', processing: true }, attachTo: document.body });
        await new Promise((resolve) => setTimeout(resolve, 0));

        const confirm = document.querySelector('[data-test="confirm"]') as HTMLButtonElement;
        expect(confirm.textContent?.trim()).toBe('Merge');
        expect(confirm.disabled).toBe(true);
        expect((document.querySelector('[data-test="cancel"]') as HTMLButtonElement).disabled).toBe(true);

        wrapper.unmount();
    });
});
