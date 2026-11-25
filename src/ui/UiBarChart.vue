<script setup lang="ts">
import UiSwatch from './UiSwatch.vue';
import { chartFills, labelEvery, niceTicks, rowTotal, type UiBarChartRow, type UiBarChartSeries } from './chart';
import { kitLocale, useTrans } from './kit';
import { computed } from 'vue';

/**
 * Stacked bars without a chart library. Vertical: a column per row (the
 * days of a month), the labels under it thinned when they crowd. Horizontal:
 * the label, the bar and its total on one line (tasks by team). The
 * reader gets a legend, a native tooltip per segment and, through assistive
 * tech, a summary and a table of every number.
 */
const props = withDefaults(
    defineProps<{
        series: UiBarChartSeries[];
        rows: UiBarChartRow[];
        orientation?: 'vertical' | 'horizontal';
        /** What the chart shows; it names the chart for assistive tech and captions its table. */
        label?: string;
        empty?: string;
    }>(),
    { orientation: 'vertical', label: undefined, empty: undefined },
);

const t = useTrans();
const format = (value: number): string => new Intl.NumberFormat(kitLocale()).format(value);

interface Bar {
    row: UiBarChartRow;
    total: number;
    segments: { key: string; value: number; share: number; fill: string; title: string; end: boolean }[];
}

const totals = computed(() => props.rows.map((row) => rowTotal(row, props.series)));
const grandTotal = computed(() => totals.value.reduce((sum, value) => sum + value, 0));
const isEmpty = computed(() => grandTotal.value === 0);
const ticks = computed(() => niceTicks(Math.max(0, ...totals.value)));
const scale = computed(() => (props.orientation === 'vertical' ? (ticks.value.at(-1) ?? 0) : Math.max(0, ...totals.value)) || 1);

const bars = computed((): Bar[] =>
    props.rows.map((row, index) => {
        const parts = props.series.map((item) => ({ item, value: Math.max(0, row.values[item.key] ?? 0) })).filter((part) => part.value > 0);

        return {
            row,
            total: totals.value[index] ?? 0,
            segments: parts.map(({ item, value }, position) => ({
                key: item.key,
                value,
                share: (value / scale.value) * 100,
                fill: chartFills[item.tone],
                title: `${row.hint ?? row.label} · ${item.label}: ${format(value)}`,
                end: position === parts.length - 1,
            })),
        };
    }),
);

const mobileEvery = computed(() => labelEvery(props.rows.length, 8));
const wideEvery = computed(() => labelEvery(props.rows.length, 16));

function tickLabelClass(index: number): string {
    if (index % mobileEvery.value === 0) {
        return '';
    }

    return index % wideEvery.value === 0 ? 'invisible sm:visible' : 'invisible';
}

const summary = computed(() => {
    const parts = props.series.map((item) => `${item.label} ${format(props.rows.reduce((sum, row) => sum + Math.max(0, row.values[item.key] ?? 0), 0))}`).join(', ');

    return `${props.label ?? t('ui.chart.label')}. ${t('ui.chart.summary', { total: format(grandTotal.value), rows: props.rows.length, parts }, props.rows.length)}`;
});
</script>

<template>
    <figure class="min-w-0" data-test="chart" :data-orientation="props.orientation">
        <p v-if="isEmpty" class="py-8 text-center text-sm text-ink-muted" data-test="chart-empty">{{ props.empty ?? t('ui.empty') }}</p>
        <template v-else>
            <ul v-if="props.series.length > 1" class="mb-3 flex flex-wrap gap-x-4 gap-y-1" aria-hidden="true" data-test="chart-legend">
                <li v-for="item in props.series" :key="item.key"><UiSwatch :color="`var(--color-chart-${item.tone})`">{{ item.label }}</UiSwatch></li>
            </ul>

            <div v-if="props.orientation === 'vertical'" role="img" :aria-label="summary" class="flex gap-2">
                <div class="relative h-48 w-8 shrink-0 text-right text-[11px] tabular-nums leading-none text-ink-subtle" aria-hidden="true">
                    <span v-for="tick in ticks" :key="tick" class="absolute right-0 translate-y-1/2" :style="{ bottom: `${(tick / scale) * 100}%` }" data-test="chart-tick">{{ format(tick) }}</span>
                </div>
                <div class="min-w-0 flex-1">
                    <div class="relative flex h-48 items-end border-b border-line-strong">
                        <span v-for="tick in ticks.slice(1)" :key="tick" class="pointer-events-none absolute inset-x-0 border-t border-line" :style="{ bottom: `${(tick / scale) * 100}%` }" aria-hidden="true" />
                        <div v-for="bar in bars" :key="bar.row.key" class="relative flex h-full min-w-0 flex-1 flex-col-reverse items-center hover:bg-canvas" :title="`${bar.row.hint ?? bar.row.label}: ${format(bar.total)}`" data-test="chart-bar">
                            <span
                                v-for="segment in bar.segments"
                                :key="segment.key"
                                class="block w-[70%] max-w-6 border-t-2 border-surface last:border-t-0"
                                :class="[segment.fill, segment.end ? 'rounded-t' : '']"
                                :style="{ height: `max(${segment.share}%, 4px)` }"
                                :title="segment.title"
                                :data-series="segment.key"
                                data-test="chart-segment"
                            />
                        </div>
                    </div>
                    <div class="mt-1 flex text-[11px] leading-none text-ink-muted">
                        <span v-for="(bar, index) in bars" :key="bar.row.key" class="min-w-0 flex-1 text-center whitespace-nowrap" :class="tickLabelClass(index)" data-test="chart-label">{{ bar.row.label }}</span>
                    </div>
                </div>
            </div>

            <div v-else role="img" :aria-label="summary" class="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 text-sm">
                <template v-for="bar in bars" :key="bar.row.key">
                    <span class="truncate text-ink" :title="bar.row.hint ?? bar.row.label" data-test="chart-label">{{ bar.row.label }}</span>
                    <span class="flex h-3 min-w-0" data-test="chart-bar">
                        <span
                            v-for="segment in bar.segments"
                            :key="segment.key"
                            class="block h-full border-r-2 border-surface last:border-r-0"
                            :class="[segment.fill, segment.end ? 'rounded-r' : '']"
                            :style="{ width: `max(${segment.share}%, 4px)` }"
                            :title="segment.title"
                            :data-series="segment.key"
                            data-test="chart-segment"
                        />
                    </span>
                    <span class="text-right tabular-nums text-ink" data-test="chart-total"><slot name="total" :row="bar.row" :total="bar.total">{{ format(bar.total) }}</slot></span>
                </template>
            </div>

            <!-- A table refuses the 1px width of sr-only and would widen the page; the wrapper takes it instead. -->
            <div class="sr-only">
                <table data-test="chart-table">
                    <caption>{{ props.label ?? t('ui.chart.label') }}</caption>
                    <thead>
                        <tr>
                            <th scope="col">{{ t('ui.chart.category') }}</th>
                            <th v-for="item in props.series" :key="item.key" scope="col">{{ item.label }}</th>
                            <th scope="col">{{ t('ui.chart.total') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="bar in bars" :key="bar.row.key">
                            <th scope="row">{{ bar.row.hint ?? bar.row.label }}</th>
                            <td v-for="item in props.series" :key="item.key">{{ format(Math.max(0, bar.row.values[item.key] ?? 0)) }}</td>
                            <td>{{ format(bar.total) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </figure>
</template>
