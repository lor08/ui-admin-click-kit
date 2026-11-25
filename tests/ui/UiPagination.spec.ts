import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiPagination from '../../src/ui/UiPagination.vue';

const pages = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('li button[aria-label^="Page"], li span[aria-hidden]').map((el) => el.text());

describe('UiPagination', () => {
    it('shows the first, the last, the neighbours and gaps, marks the current page and reports the summary', () => {
        const wrapper = mount(UiPagination, { props: { page: 5, lastPage: 10, total: 487, perPage: 50 } });

        expect(pages(wrapper)).toEqual(['1', '…', '4', '5', '6', '…', '10']);
        expect(wrapper.get('[aria-current="page"]').text()).toBe('5');
        expect(wrapper.get('[data-test="summary"]').text()).toBe('201–250 of 487');
        expect(wrapper.attributes('aria-label')).toBe('Pages');
    });

    it('fills a gap of one page with the page itself and disables the arrows at the ends', async () => {
        const first = mount(UiPagination, { props: { page: 1, lastPage: 4 } });
        expect(pages(first)).toEqual(['1', '2', '3', '4']);
        expect(first.get('[data-test="previous"]').attributes('disabled')).toBeDefined();
        expect(first.find('[data-test="summary"]').exists()).toBe(false);

        const last = mount(UiPagination, { props: { page: 4, lastPage: 4 } });
        expect(last.get('[data-test="next"]').attributes('disabled')).toBeDefined();

        await first.get('[data-test="next"]').trigger('click');
        await first.get('button[aria-label="Page 4"]').trigger('click');
        await first.get('button[aria-label="Page 1"]').trigger('click');

        expect(first.emitted('update:page')).toEqual([[2], [4]]);
    });
});
