import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UiCopyField from '../../src/ui/UiCopyField.vue';

const link = 'https://example.com/invites/token123';

afterEach(() => vi.unstubAllGlobals());

describe('UiCopyField', () => {
    it('shows the value read only under its label and copies it', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal('navigator', { clipboard: { writeText } });
        const wrapper = mount(UiCopyField, { props: { value: link, label: 'Signing link', id: 'sign_url' }, attachTo: document.body });

        const input = wrapper.get('input');
        expect(wrapper.get('label').text()).toContain('Signing link');
        expect(input.attributes('id')).toBe('sign_url');
        expect((input.element as HTMLInputElement).value).toBe(link);
        expect(input.attributes('readonly')).toBeDefined();
        expect(wrapper.get('[data-test="copy"]').text()).toBe('Copy');
        expect(wrapper.find('[data-test="copied"]').exists()).toBe(false);

        await wrapper.get('[data-test="copy"]').trigger('click');
        await flushPromises();

        expect(writeText).toHaveBeenCalledWith(link);
        expect(wrapper.get('[data-test="copied"]').text()).toBe('Copied.');
        expect(wrapper.emitted('copied')).toHaveLength(1);
        wrapper.unmount();
    });

    it('selects the value for a manual copy when the browser refuses the clipboard', async () => {
        vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
        document.execCommand = vi.fn().mockReturnValue(false);
        const wrapper = mount(UiCopyField, { props: { value: link, copyLabel: 'Copy the link' }, attachTo: document.body });
        const input = wrapper.get('input').element as HTMLInputElement;

        expect(wrapper.get('[data-test="copy"]').text()).toBe('Copy the link');
        await wrapper.get('[data-test="copy"]').trigger('click');
        await flushPromises();

        expect(wrapper.find('[data-test="copied"]').exists()).toBe(false);
        expect(input.selectionStart).toBe(0);
        expect(input.selectionEnd).toBe(link.length);
        wrapper.unmount();
    });
});
