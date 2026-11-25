<script setup lang="ts">
import type { Tone } from './styles';
import { computed } from 'vue';

/**
 * A short status word: the tone says whether it is good, bad or neutral,
 * `dot` draws the state as a colored point before the word.
 */
const props = withDefaults(defineProps<{ tone?: Tone; size?: 'sm' | 'md'; dot?: boolean; outline?: boolean }>(), {
    tone: 'neutral',
    size: 'md',
    dot: false,
    outline: false,
});

const tones: Record<Tone, string> = {
    neutral: 'bg-canvas text-ink-muted border-line',
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-success-surface text-success border-success/30',
    warning: 'bg-warning-surface text-warning border-warning/30',
    danger: 'bg-danger-surface text-danger border-danger/30',
    info: 'bg-info-surface text-info border-info/30',
};

const dots: Record<Tone, string> = {
    neutral: 'bg-ink-subtle',
    brand: 'bg-brand-600',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
};

const outlines: Record<Tone, string> = {
    neutral: 'text-ink-muted border-line-strong',
    brand: 'text-brand-700 border-brand-500',
    success: 'text-success border-success',
    warning: 'text-warning border-warning',
    danger: 'text-danger border-danger',
    info: 'text-info border-info',
};

const classes = computed(() => [
    'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
    props.size === 'sm' ? 'px-1.5 py-px text-[11px]' : 'px-2 py-0.5 text-xs',
    props.outline ? outlines[props.tone] : tones[props.tone],
]);
</script>

<template>
    <span :class="classes" :data-tone="props.tone">
        <span v-if="props.dot" class="h-1.5 w-1.5 shrink-0 rounded-full" :class="dots[props.tone]" aria-hidden="true" />
        <slot />
    </span>
</template>
