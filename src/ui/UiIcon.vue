<script setup lang="ts">
import { ICONS, type IconName } from './icons';

/** One icon of the registry, sized by the text around it, as Click's `mdi` font glyph is; decorative unless labelled. */
const props = defineProps<{ name: IconName; label?: string }>();
</script>

<template>
    <svg class="inline-block h-[1.2em] w-[1.2em] shrink-0 fill-current align-[-0.2em]" viewBox="0 0 24 24" :role="props.label ? 'img' : undefined" :aria-label="props.label" :aria-hidden="props.label ? undefined : 'true'">
        <path :d="ICONS[props.name]" />
    </svg>
</template>
