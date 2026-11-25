<script setup lang="ts">
/**
 * A form that stops the browser's submit, disables its actions while the
 * request runs and shows an error that belongs to no single field.
 */
const props = withDefaults(
    defineProps<{
        processing?: boolean;
        error?: string | null;
    }>(),
    { processing: false, error: null },
);

const emit = defineEmits<{ submit: [] }>();
</script>

<template>
    <form class="space-y-4" novalidate @submit.prevent="emit('submit')">
        <p v-if="props.error" class="rounded-control border border-danger/30 bg-danger-surface px-3 py-2 text-sm text-danger" data-test="form-error">
            {{ props.error }}
        </p>
        <slot />
        <fieldset v-if="$slots.actions" class="flex flex-wrap items-center gap-2 pt-2" :disabled="props.processing">
            <slot name="actions" />
        </fieldset>
    </form>
</template>
