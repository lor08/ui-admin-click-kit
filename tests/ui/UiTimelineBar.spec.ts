import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiTimelineBar from '../../src/ui/UiTimelineBar.vue';

const segments = [
    { key: 'a', start: 0, end: 21600, tone: 'neutral' as const, label: '00:00–06:00 Offline' },
    { key: 'b', start: 21600, end: 43200, tone: 'success' as const, label: '06:00–12:00 Available' },
    { key: 'c', start: 43200, end: 43200, tone: 'brand' as const, label: 'empty' },
    { key: 'd', start: 80000, end: 90000, tone: 'warning' as const, label: 'past the end' },
];

describe('UiTimelineBar', () => {
    it('lays each stretch along the span in its tone with its tooltip, and drops an empty one', () => {
        const wrapper = mount(UiTimelineBar, { props: { segments, span: 86400, label: "Ann's day" } });
        const bars = wrapper.findAll('[data-test="timeline-segment"]');

        expect(bars.map((bar) => bar.attributes('title'))).toEqual(['00:00–06:00 Offline', '06:00–12:00 Available', 'past the end']);
        expect(bars.map((bar) => parseFloat((bar.element as HTMLElement).style.left))).toEqual([0, 25, (80000 / 86400) * 100]);
        expect((bars[1]!.element as HTMLElement).style.width).toBe('25%');
        expect(parseFloat((bars[2]!.element as HTMLElement).style.width)).toBeCloseTo((6400 / 86400) * 100, 6);
        expect(bars[0]!.classes()).toContain('bg-chart-neutral');
        expect(bars[1]!.classes()).toContain('bg-chart-success');
        expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe("Ann's day");
        expect(wrapper.findAll('li').map((li) => li.text())).toEqual(['00:00–06:00 Offline', '06:00–12:00 Available', 'past the end']);
    });

    it('marks the ticks under the bar and names itself by the kit when no label is given', () => {
        const wrapper = mount(UiTimelineBar, { props: { segments: [], span: 86400, ticks: [{ at: 0, label: '00:00' }, { at: 43200, label: '12:00' }] } });

        const ticks = wrapper.findAll('[data-test="timeline-tick"]');
        expect(ticks.map((tick) => tick.text())).toEqual(['00:00', '12:00']);
        expect((ticks[1]!.element as HTMLElement).style.left).toBe('50%');
        expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('Timeline');
        expect(wrapper.findAll('[data-test="timeline-segment"]')).toHaveLength(0);
    });
});
