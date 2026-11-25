import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UiCodeBlock from '../../src/ui/UiCodeBlock.vue';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('UiCodeBlock', () => {
    it('shows a string as is and anything else as indented JSON, in a focusable region that scrolls and wraps', () => {
        const json = mount(UiCodeBlock, { props: { value: { EventId: 'ev1', From: 'jane', answered: false }, label: 'Payload', maxHeight: 'sm' } });
        const pre = json.get('[data-test="code-text"]');

        expect(pre.text()).toBe('{\n  "EventId": "ev1",\n  "From": "jane",\n  "answered": false\n}');
        expect(pre.attributes('tabindex')).toBe('0');
        expect(pre.attributes('role')).toBe('region');
        expect(pre.attributes('aria-label')).toBe('Payload');
        expect(pre.classes()).toEqual(expect.arrayContaining(['max-h-40', 'overflow-y-auto', 'whitespace-pre-wrap', '[overflow-wrap:anywhere]', 'font-mono']));
        expect(json.get('[data-test="code-label"]').text()).toBe('Payload');

        const text = mount(UiCodeBlock, { props: { value: 'caller hung up' } });
        expect(text.get('[data-test="code-text"]').text()).toBe('caller hung up');
        expect(text.get('[data-test="code-text"]').attributes('aria-label')).toBe('Data');
        expect(text.get('[data-test="code-text"]').classes()).toContain('max-h-80');
        expect(text.find('[data-test="code-label"]').exists()).toBe(false);

        expect(mount(UiCodeBlock, { props: { value: null } }).get('[data-test="code-text"]').text()).toBe('null');
        expect(mount(UiCodeBlock, { props: { value: undefined } }).get('[data-test="code-text"]').text()).toBe('');
    });

    it('folds under its label when collapsible, closed unless asked to open', () => {
        const closed = mount(UiCodeBlock, { props: { value: { a: 1 }, label: 'Extra data', collapsible: true } });
        const details = closed.get('details');

        expect(details.attributes('open')).toBeUndefined();
        expect(closed.get('summary').text()).toBe('Extra data');
        expect(closed.find('[data-test="code-label"]').exists()).toBe(false);

        const open = mount(UiCodeBlock, { props: { value: { a: 1 }, collapsible: true, open: true } });
        expect(open.get('details').attributes('open')).toBeDefined();
        expect(open.get('summary').text()).toBe('Data');
    });

    it('copies the whole text and says so to a screen reader', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal('navigator', { clipboard: { writeText } });
        const wrapper = mount(UiCodeBlock, { props: { value: { a: 1 } } });

        expect(wrapper.get('[data-test="code-copy"]').attributes('aria-label')).toBe('Copy');
        await wrapper.get('[data-test="code-copy"]').trigger('click');
        await flush();

        expect(writeText).toHaveBeenCalledWith('{\n  "a": 1\n}');
        expect(wrapper.get('[data-test="code-copy"]').attributes('aria-label')).toBe('Copied.');
        expect(wrapper.get('[data-test="code-status"]').attributes('aria-live')).toBe('polite');
        expect(wrapper.get('[data-test="code-status"]').text()).toBe('Copied.');
        expect(wrapper.find('[data-test="copy-failed"]').exists()).toBe(false);
    });

    it('falls back to the copy command when the clipboard API is refused, and says when that fails too', async () => {
        vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
        const execCommand = vi.fn().mockReturnValue(false);
        Object.defineProperty(document, 'execCommand', { value: execCommand, configurable: true });
        const wrapper = mount(UiCodeBlock, { props: { value: 'text' } });

        await wrapper.get('[data-test="code-copy"]').trigger('click');
        await flush();

        expect(execCommand).toHaveBeenCalledWith('copy');
        expect(document.querySelector('textarea')).toBeNull();
        // The refusal is on screen, not only for a screen reader, and stays until the next try.
        expect(wrapper.get('[data-test="copy-failed"]').attributes('role')).toBe('alert');
        expect(wrapper.get('[data-test="copy-failed"]').text()).toBe('The browser did not allow copying; select the text and copy it by hand.');
    });
});
