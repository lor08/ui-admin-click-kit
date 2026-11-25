<script setup lang="ts">
import { useTrans } from './kit';

/** The caption of a control; `required` adds the marker, `optional` the word. */
const props = withDefaults(defineProps<{ for?: string; required?: boolean; optional?: boolean }>(), {
    for: undefined,
    required: false,
    optional: false,
});

const t = useTrans();
</script>

<template>
    <label class="block text-sm font-medium text-ink" :for="props.for">
        <slot />
        <span v-if="props.required" class="text-danger" aria-hidden="true">*</span>
        <span v-if="props.required" class="sr-only">({{ t('ui.required') }})</span>
        <span v-else-if="props.optional" class="font-normal text-ink-muted"> ({{ t('ui.optional') }})</span>
    </label>
</template>
