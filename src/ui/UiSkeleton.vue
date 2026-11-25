<script setup lang="ts">
/** A grey placeholder in the shape of what is loading; decorative, hidden from assistive tech. */
withDefaults(defineProps<{ shape?: 'text' | 'block' | 'circle'; lines?: number }>(), { shape: 'text', lines: 1 });
</script>

<template>
    <div aria-hidden="true" data-test="skeleton">
        <template v-if="shape === 'text'">
            <div v-for="line in lines" :key="line" class="h-3.5 animate-pulse rounded bg-surface-muted" :class="[line > 1 ? 'mt-2' : '', line === lines && lines > 1 ? 'w-2/3' : 'w-full']" />
        </template>
        <div v-else-if="shape === 'circle'" class="h-9 w-9 animate-pulse rounded-full bg-surface-muted" />
        <div v-else class="h-full min-h-16 w-full animate-pulse rounded-card bg-surface-muted" />
    </div>
</template>
