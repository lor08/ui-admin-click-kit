<script setup lang="ts">
/** A line between two parts; with a slot, the word sits in the middle of it. */
withDefaults(defineProps<{ vertical?: boolean }>(), { vertical: false });
</script>

<template>
    <div v-if="vertical" role="separator" aria-orientation="vertical" class="h-5 w-px self-center bg-line" />
    <div v-else-if="$slots.default" role="separator" class="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-ink-muted">
        <span class="h-px grow bg-line" />
        <slot />
        <span class="h-px grow bg-line" />
    </div>
    <hr v-else class="border-line" />
</template>
