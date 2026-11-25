<script setup lang="ts">
/**
 * A small square of a color, with the word it stands for after it: the
 * color of an area on the map, a key of a map legend. The color is data
 * (it comes from the map's palette), so it is a prop, not a tone.
 */
const props = withDefaults(defineProps<{ color: string; border?: string | null; size?: 'sm' | 'md' }>(), { border: null, size: 'sm' });
</script>

<template>
    <span class="inline-flex min-w-0 items-center gap-1.5 text-xs text-ink-muted" data-test="swatch">
        <span
            class="shrink-0 rounded-[3px]"
            :class="props.size === 'sm' ? 'h-3 w-3' : 'h-4 w-4 border-2'"
            :style="{ backgroundColor: props.color, borderColor: props.border ?? props.color }"
            aria-hidden="true"
            data-test="swatch-color"
        />
        <span v-if="$slots.default" class="min-w-0 truncate"><slot /></span>
    </span>
</template>
