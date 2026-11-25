<script setup lang="ts">
import UiFieldError from './UiFieldError.vue';
import { useId } from 'vue';

/** One yes/no choice with its own label; a list of them belongs in a fieldset of the page. */
const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        label: string;
        id?: string;
        description?: string | null;
        error?: string | null;
        disabled?: boolean;
        /** Some, not all, of what the box stands for is checked (the box of a group). */
        indeterminate?: boolean;
        /** The label in monospace, for a name from the code (a permission). */
        mono?: boolean;
    }>(),
    { id: undefined, description: null, error: null, disabled: false, indeterminate: false, mono: false },
);

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const fallbackId = useId();
const inputId = props.id ?? fallbackId;
</script>

<template>
    <div>
        <label class="flex items-start gap-2.5 text-sm text-ink" :class="props.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'" :for="inputId">
            <input
                :id="inputId"
                type="checkbox"
                class="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-brand-600 accent-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                :checked="props.modelValue"
                :indeterminate.prop="props.indeterminate"
                :aria-checked="props.indeterminate ? 'mixed' : undefined"
                :disabled="props.disabled"
                :aria-invalid="props.error ? 'true' : undefined"
                :aria-describedby="props.description || props.error ? `${inputId}-note` : undefined"
                @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
            />
            <span>
                <span class="font-medium" :class="props.mono ? 'font-mono text-xs' : ''">{{ props.label }}</span>
                <span v-if="props.description" :id="props.error ? undefined : `${inputId}-note`" class="block text-xs text-ink-muted">{{ props.description }}</span>
            </span>
        </label>
        <UiFieldError v-if="props.error" :id="`${inputId}-note`" :message="props.error" class="mt-1" />
    </div>
</template>
