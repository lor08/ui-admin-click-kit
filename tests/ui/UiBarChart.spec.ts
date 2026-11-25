import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiBarChart from '../../src/ui/UiBarChart.vue';
import { labelEvery, niceTicks, type UiBarChartRow } from '../../src/ui/chart';

const series = [
    { key: 'answered', label: 'Answered', tone: 'success' as const },
    { key: 'missed', label: 'Missed', tone: 'danger' as const },
];

const days: UiBarChartRow[] = [
    { key: 'd1', label: '1', hint: 'Nov 1', values: { answered: 30, missed: 7 } },
    { key: 'd2', label: '2', hint: 'Nov 2', values: { answered: 10 } },
    { key: 'd3', label: '3', values: { answered: 0, missed: 0 } },
];

describe('UiBarChart', () => {
    it('draws a stacked column per row, bottom part first, on a round scale, with a legend and a tooltip per part', () => {
        const wrapper = mount(UiBarChart, { props: { series, rows: days, label: 'Calls by day' } });

        expect(wrapper.findAll('[data-test="chart-legend"] li').map((li) => li.text())).toEqual(['Answered', 'Missed']);
        expect(wrapper.findAll('[data-test="chart-tick"]').map((tick) => tick.text())).toEqual(['0', '10', '20', '30', '40']);

        const columns = wrapper.findAll('[data-test="chart-bar"]');
        expect(columns).toHaveLength(3);

        const first = columns[0]!.findAll('[data-test="chart-segment"]');
        expect(first.map((segment) => segment.attributes('data-series'))).toEqual(['answered', 'missed']);
        expect(first.map((segment) => segment.attributes('title'))).toEqual(['Nov 1 · Answered: 30', 'Nov 1 · Missed: 7']);
        expect(first[0]!.attributes('style')).toContain('max(75%, 4px)');
        expect(first[0]!.classes()).toContain('bg-chart-success');
        expect(first[0]!.classes()).not.toContain('rounded-t');
        expect(first[1]!.classes()).toEqual(expect.arrayContaining(['bg-chart-danger', 'rounded-t']));

        expect(columns[1]!.findAll('[data-test="chart-segment"]').map((segment) => segment.attributes('title'))).toEqual(['Nov 2 · Answered: 10']);
        expect(columns[2]!.findAll('[data-test="chart-segment"]')).toHaveLength(0);
        expect(columns[2]!.attributes('title')).toBe('3: 0');
    });

    it('is one image to assistive tech, named by a summary, with every number in a hidden table', () => {
        const wrapper = mount(UiBarChart, { props: { series, rows: days, label: 'Calls by day' } });

        const image = wrapper.get('[role="img"]');
        expect(image.attributes('aria-label')).toBe('Calls by day. Total 47 over 3 bars: Answered 40, Missed 7.');
        expect(wrapper.get('[data-test="chart-legend"]').attributes('aria-hidden')).toBe('true');

        const table = wrapper.get('[data-test="chart-table"]');
        expect(table.element.parentElement?.classList).toContain('sr-only');
        expect(table.get('caption').text()).toBe('Calls by day');
        expect(table.findAll('thead th').map((th) => th.text())).toEqual(['Item', 'Answered', 'Missed', 'Total']);
        expect(table.findAll('tbody tr').map((tr) => tr.findAll('th, td').map((cell) => cell.text()))).toEqual([
            ['Nov 1', '30', '7', '37'],
            ['Nov 2', '10', '0', '10'],
            ['3', '0', '0', '0'],
        ]);
    });

    it('thins the day labels of a month: every fourth on a phone, every second from sm up', () => {
        const month = Array.from({ length: 31 }, (_, index) => ({ key: `d${index}`, label: String(index + 1), values: { answered: 1 } }));
        const labels = mount(UiBarChart, { props: { series, rows: month } }).findAll('[data-test="chart-label"]');

        expect(labels).toHaveLength(31);
        expect(labels[0]!.classes()).not.toContain('invisible');
        expect(labels[1]!.classes()).toContain('invisible');
        expect(labels[1]!.classes()).not.toContain('sm:visible');
        expect(labels[2]!.classes()).toEqual(expect.arrayContaining(['invisible', 'sm:visible']));
        expect(labels[4]!.classes()).not.toContain('invisible');
    });

    it('draws a line per row with its total on the right when horizontal, the longest one full width', () => {
        const channels: UiBarChartRow[] = [
            { key: 'google', label: 'Team North', values: { answered: 150, missed: 50 } },
            { key: 'east', label: 'Team East', values: { answered: 50 } },
        ];
        const wrapper = mount(UiBarChart, { props: { series, rows: channels, orientation: 'horizontal' } });

        expect(wrapper.get('[data-test="chart"]').attributes('data-orientation')).toBe('horizontal');
        expect(wrapper.findAll('[data-test="chart-label"]').map((label) => label.text())).toEqual(['Team North', 'Team East']);
        expect(wrapper.findAll('[data-test="chart-total"]').map((total) => total.text())).toEqual(['200', '50']);
        const google = wrapper.findAll('[data-test="chart-bar"]')[0]!.findAll('[data-test="chart-segment"]');
        expect(google.map((segment) => segment.attributes('style'))).toEqual(['width: max(75%, 4px);', 'width: max(25%, 4px);']);
        expect(google[1]!.classes()).toContain('rounded-r');
        expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('Chart. Total 250 over 2 bars: Answered 200, Missed 50.');

        const slotted = mount(UiBarChart, {
            props: { series, rows: channels, orientation: 'horizontal' },
            slots: { total: '<template #total="{ row, total }">{{ row.key }}={{ total }}</template>' },
        });
        expect(slotted.findAll('[data-test="chart-total"]').map((total) => total.text())).toEqual(['google=200', 'east=50']);
    });

    it('says there is nothing to show when there are no rows or every value is zero, and drops the legend of a single series', () => {
        const none = mount(UiBarChart, { props: { series, rows: [], empty: 'No calls in this period.' } });
        expect(none.get('[data-test="chart-empty"]').text()).toBe('No calls in this period.');
        expect(none.find('[role="img"]').exists()).toBe(false);
        expect(none.find('[data-test="chart-table"]').exists()).toBe(false);

        const zeros = mount(UiBarChart, { props: { series, rows: [days[2]!] } });
        expect(zeros.get('[data-test="chart-empty"]').text()).toBe('Nothing here yet.');

        const single = mount(UiBarChart, { props: { series: [series[0]!], rows: days } });
        expect(single.find('[data-test="chart-legend"]').exists()).toBe(false);
    });
});

describe('the chart scale', () => {
    it('steps by 1, 2 or 5 times a power of ten and never by a fraction of a count', () => {
        expect(niceTicks(37)).toEqual([0, 10, 20, 30, 40]);
        expect(niceTicks(3)).toEqual([0, 1, 2, 3]);
        expect(niceTicks(130)).toEqual([0, 50, 100, 150]);
        expect(niceTicks(0)).toEqual([0]);
        expect(labelEvery(31, 8)).toBe(4);
        expect(labelEvery(5, 8)).toBe(1);
    });
});
