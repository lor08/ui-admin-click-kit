<script setup lang="ts">
import { computed } from 'vue';

export type TextTone = 'default' | 'muted' | 'subtle';

/**
 * A run of secondary text: a note beside a value, the placeholder of an
 * empty cell, a name from the code. The page picks the tone and whether
 * it is a line of its own; the kit owns the colours and the font.
 */
const props = withDefaults(defineProps<{ tone?: TextTone; size?: 'sm' | 'xs'; mono?: boolean; block?: boolean; lines?: boolean }>(), {
    tone: 'muted',
    size: 'sm',
    mono: false,
    block: false,
    lines: false,
});

const tones: Record<TextTone, string> = { default: 'text-ink', muted: 'text-ink-muted', subtle: 'text-ink-subtle' };

const classes = computed(() => [tones[props.tone], props.size === 'xs' ? 'text-xs' : 'text-sm', props.mono ? 'font-mono [overflow-wrap:anywhere]' : '', props.lines ? 'whitespace-pre-line' : '']);
</script>

<template>
    <p v-if="props.block" :class="classes" data-test="text"><slot /></p>
    <span v-else :class="classes" data-test="text"><slot /></span>
</template>
