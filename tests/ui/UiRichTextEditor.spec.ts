import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UiRichTextEditor from '../../src/ui/UiRichTextEditor.vue';

const labels = { bold: 'Bold', italic: 'Italic', underline: 'Underline', color: 'Text colour', background: 'Background colour', clear: 'Clear the marks' };

afterEach(() => vi.unstubAllGlobals());

describe('UiRichTextEditor', () => {
    it('draws the value, reports every change and draws a value replaced from outside', async () => {
        const wrapper = mount(UiRichTextEditor, { props: { modelValue: '<p><b>Hi</b></p>', label: 'Message', labels } });
        const area = wrapper.get('[data-test="rich-area"]');

        expect(area.element.innerHTML).toBe('<p><b>Hi</b></p>');
        expect(wrapper.get('label').text()).toContain('Message');
        area.element.innerHTML = '<p>Hello</p>';
        await area.trigger('input');
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['<p>Hello</p>']);

        await wrapper.setProps({ modelValue: '' });
        expect(area.element.innerHTML).toBe('');
    });

    it('writes marks as tags and only colours as styles, which the server keeps', async () => {
        const execCommand = vi.fn(() => true);
        vi.stubGlobal('document', Object.assign(document, { execCommand }));
        const wrapper = mount(UiRichTextEditor, { props: { modelValue: '', labels }, attachTo: document.body });

        await wrapper.get('[data-test="rich-bold"]').trigger('click');
        expect(execCommand).toHaveBeenCalledWith('styleWithCSS', false, 'false');
        expect(execCommand).toHaveBeenCalledWith('bold', false, undefined);

        await wrapper.get('[data-test="rich-color"]').trigger('click');
        await wrapper.get('[data-test="rich-swatch"]').trigger('click');
        expect(execCommand).toHaveBeenCalledWith('styleWithCSS', false, 'true');
        expect(execCommand).toHaveBeenCalledWith('foreColor', false, '#e60000');
        expect(wrapper.find('[data-test="rich-swatch"]').exists()).toBe(false);
        wrapper.unmount();
    });
});
