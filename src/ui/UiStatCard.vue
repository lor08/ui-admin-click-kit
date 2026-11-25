<script setup lang="ts">
import UiSkeleton from './UiSkeleton.vue';
import { kitLink } from './kit';
import { computed } from 'vue';
import type { Tone } from './styles';

/**
 * One number with its name: a card on a dashboard, or, `compact`, a chip
 * for the header row for the counts in a header row. The tone
 * says whether the number wants attention. With `href` it opens the list
 * behind it.
 */
const props = withDefaults(
    defineProps<{
        label: string;
        value: string | number | null;
        hint?: string | null;
        tone?: Tone;
        href?: string;
        loading?: boolean;
        compact?: boolean;
        /** Compact only: the width from which the label is written out; below it the icon and the number stand alone. */
        labelFrom?: 'sm' | 'md' | 'xl';
    }>(),
    { hint: null, tone: 'neutral', href: undefined, loading: false, compact: false, labelFrom: 'md' },
);

const labelVisibility: Record<NonNullable<typeof props.labelFrom>, [string, string]> = {
    sm: ['hidden sm:inline', 'sr-only sm:hidden'],
    md: ['hidden md:inline', 'sr-only md:hidden'],
    xl: ['hidden xl:inline', 'sr-only xl:hidden'],
};

const chipTones: Record<Tone, string> = {
    neutral: 'border-line bg-surface text-ink',
    brand: 'border-brand-200 bg-brand-50 text-brand-700',
    success: 'border-success/30 bg-success-surface text-success',
    warning: 'border-warning/30 bg-warning-surface text-warning',
    danger: 'border-danger/30 bg-danger-surface text-danger',
    info: 'border-info/30 bg-info-surface text-info',
};

const valueTones: Record<Tone, string> = {
    neutral: 'text-ink',
    brand: 'text-brand-700',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    info: 'text-info',
};

const link = kitLink();
const tag = computed(() => (props.href ? link : 'div'));
const shown = computed(() => (props.value === null ? '—' : String(props.value)));
</script>

<template>
    <component
        :is="tag"
        :href="props.href"
        :title="props.hint ?? undefined"
        :class="[
            props.compact
                ? ['inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium whitespace-nowrap', chipTones[props.tone]]
                : 'block rounded-card border border-line bg-surface p-4',
            props.href ? 'transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600' : '',
        ]"
        :data-tone="props.tone"
        data-test="stat"
    >
        <template v-if="props.compact">
            <span class="[&>svg]:h-3.5 [&>svg]:w-3.5"><slot name="icon" /></span>
            <span class="opacity-80" :class="labelVisibility[props.labelFrom][0]">{{ props.label }}</span>
            <span :class="labelVisibility[props.labelFrom][1]">{{ props.label }}</span>
            <UiSkeleton v-if="props.loading" class="w-5" />
            <span v-else class="font-semibold tabular-nums" data-test="value">{{ shown }}</span>
        </template>
        <template v-else>
            <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-medium text-ink-muted">{{ props.label }}</p>
                <span class="text-ink-subtle [&>svg]:h-5 [&>svg]:w-5"><slot name="icon" /></span>
            </div>
            <UiSkeleton v-if="props.loading" class="mt-3 w-1/2" />
            <p v-else class="mt-2 text-2xl font-semibold tabular-nums" :class="valueTones[props.tone]" data-test="value">{{ shown }}</p>
            <p v-if="props.hint" class="mt-1 text-xs text-ink-muted">{{ props.hint }}</p>
        </template>
    </component>
</template>
