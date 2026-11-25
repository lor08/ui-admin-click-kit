import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UiToaster from '../../src/ui/UiToaster.vue';
import { useToast } from '../../src/ui/toast';

describe('UiToaster and useToast', () => {
    beforeEach(() => useToast().clear());

    it('shows what is pushed, in its tone, and hides it after its timeout', async () => {
        vi.useFakeTimers();
        const wrapper = mount(UiToaster);
        const toast = useToast();

        toast.success('Saved.', 'The project has a new owner.');
        toast.error('Failed.');
        await wrapper.vm.$nextTick();

        const toasts = wrapper.findAll('[data-test="toast"]');
        expect(toasts).toHaveLength(2);
        expect(toasts[0]?.text()).toContain('Saved.');
        expect(toasts[0]?.text()).toContain('The project has a new owner.');
        expect(toasts[0]?.attributes('role')).toBe('status');
        expect(toasts[0]?.classes()).toContain('text-success');
        expect(toasts[1]?.attributes('role')).toBe('alert');
        expect(toasts[1]?.classes()).toContain('text-danger');

        vi.advanceTimersByTime(5001);
        await wrapper.vm.$nextTick();
        expect(wrapper.findAll('[data-test="toast"]').map((t) => t.text())).toEqual([expect.stringContaining('Failed.')]);

        vi.advanceTimersByTime(3000);
        await wrapper.vm.$nextTick();
        expect(wrapper.findAll('[data-test="toast"]')).toHaveLength(0);

        vi.useRealTimers();
    });

    it('closes a toast on its button and keeps one with no timeout', async () => {
        vi.useFakeTimers();
        const wrapper = mount(UiToaster);
        const toast = useToast();

        toast.push({ title: 'Stays', timeout: 0 });
        await wrapper.vm.$nextTick();
        vi.advanceTimersByTime(60_000);
        await wrapper.vm.$nextTick();
        expect(wrapper.findAll('[data-test="toast"]')).toHaveLength(1);

        await wrapper.get('[data-test="toast"] button[aria-label="Close"]').trigger('click');
        expect(wrapper.findAll('[data-test="toast"]')).toHaveLength(0);

        vi.useRealTimers();
    });
});
