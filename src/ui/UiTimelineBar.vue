<script setup lang="ts">
import { chartFills } from './chart';
import { useTrans } from './kit';
import type { Tone } from './styles';
import { computed } from 'vue';

/** One stretch of a timeline: from `start` to `end` in the units of `span`, its state's tone and words. */
export interface UiTimelineSegment {
    key: string;
    start: number;
    end: number;
    tone: Tone;
    label: string;
}

/** A mark under the bar at `at` (an hour of the day). */
export interface UiTimelineTick {
    at: number;
    label: string;
}

/**
 * A day on one line: the stretches of a state laid along a bar of `span`
 * units (seconds of a day, say), each with its tone and a native tooltip,
 * the rest of the span left empty (time still to come). Positions are set
 * through Vue's style binding, which the hosts' Content-Security-Policy
 * allows. Assistive tech reads the label and a list of the stretches.
 */
const props = withDefaults(
    defineProps<{
        segments: UiTimelineSegment[];
        span: number;
        ticks?: UiTimelineTick[];
        /** What the bar shows: it names the bar for assistive tech. */
        label?: string;
    }>(),
    { ticks: () => [], label: undefined },
);

const t = useTrans();

const share = (value: number): number => (props.span > 0 ? (Math.min(props.span, Math.max(0, value)) / props.span) * 100 : 0);

const bars = computed(() =>
    props.segments
        .filter((segment) => segment.end > segment.start)
        .map((segment) => ({ ...segment, left: share(segment.start), width: share(segment.end) - share(segment.start), fill: chartFills[segment.tone] })),
);

const marks = computed(() => props.ticks.map((tick) => ({ ...tick, left: share(tick.at) })));
</script>

<template>
    <figure class="min-w-0" data-test="timeline">
        <div role="img" :aria-label="props.label ?? t('ui.timeline.label')" class="relative h-4 w-full overflow-hidden rounded bg-canvas ring-1 ring-line ring-inset">
            <span
                v-for="bar in bars"
                :key="bar.key"
                class="absolute inset-y-0 block"
                :class="bar.fill"
                :style="{ left: `${bar.left}%`, width: `${bar.width}%` }"
                :title="bar.label"
                data-test="timeline-segment"
            />
        </div>
        <div v-if="marks.length > 0" class="relative mt-1 h-3 text-[11px] leading-none text-ink-subtle" aria-hidden="true">
            <span v-for="mark in marks" :key="mark.at" class="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full" :style="{ left: `${mark.left}%` }" data-test="timeline-tick">{{ mark.label }}</span>
        </div>
        <ul class="sr-only">
            <li v-for="bar in bars" :key="bar.key">{{ bar.label }}</li>
        </ul>
    </figure>
</template>
