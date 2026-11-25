<script setup lang="ts">
/** A line under a control that explains it; a control points at it with aria-describedby. */
withDefaults(defineProps<{ id?: string }>(), { id: undefined });
</script>

<template>
    <p :id="id" class="text-sm text-ink-muted" data-test="hint"><slot /></p>
</template>
