import type { Tone } from './styles';

/** One stacked part of every bar: a measure with its name and its tone. */
export interface UiBarChartSeries {
    key: string;
    label: string;
    tone: Tone;
}

/** One bar: a day, a team. `values` maps a series key to its amount; a missing key is zero. */
export interface UiBarChartRow {
    key: string;
    label: string;
    values: Record<string, number>;
    /** A longer name for the tooltip (the full date under a day number). */
    hint?: string;
}

/** The fill of a mark per tone, from the chart tokens of base.css. */
export const chartFills: Record<Tone, string> = {
    neutral: 'bg-chart-neutral',
    brand: 'bg-chart-brand',
    success: 'bg-chart-success',
    warning: 'bg-chart-warning',
    danger: 'bg-chart-danger',
    info: 'bg-chart-info',
};

export function rowTotal(row: UiBarChartRow, series: UiBarChartSeries[]): number {
    return series.reduce((sum, item) => sum + Math.max(0, row.values[item.key] ?? 0), 0);
}

/**
 * Round axis ticks from zero to at least `max`: a step of 1, 2 or 5 times a
 * power of ten, about four steps, never a fraction of a count.
 */
export function niceTicks(max: number, steps = 4): number[] {
    if (max <= 0) {
        return [0];
    }
    const raw = max / steps;
    const power = 10 ** Math.floor(Math.log10(raw));
    const step = Math.max(1, [1, 2, 5, 10].map((factor) => factor * power).find((candidate) => candidate >= raw) ?? 10 * power);
    const top = Math.ceil(max / step) * step;

    return Array.from({ length: Math.round(top / step) + 1 }, (_, index) => index * step);
}

/** Every how many columns a label is printed so that at most `room` labels fit. */
export function labelEvery(count: number, room: number): number {
    return Math.max(1, Math.ceil(count / room));
}
