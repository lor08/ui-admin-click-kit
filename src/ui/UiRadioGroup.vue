<script setup lang="ts">
import UiFieldError from './UiFieldError.vue';
import { useId } from 'vue';

export interface UiRadioOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
    /** The level in a tree of options: each level is indented one step. */
    depth?: number;
    /** A heading of the tree, not a choice: bold, without a radio. */
    group?: boolean;
}

/**
 * One choice out of a few that all fit on screen; a long list is a
 * UiSelect. Options with a `depth` make a tree whose `group` rows head
 * their children, as a tree of reasons for closing a record.
 */
const props = withDefaults(
    defineProps<{
        modelValue: string;
        options: UiRadioOption[];
        label?: string;
        name?: string;
        error?: string | null;
        inline?: boolean;
        disabled?: boolean;
    }>(),
    { label: undefined, name: undefined, error: null, inline: false, disabled: false },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const groupId = useId();
const name = props.name ?? groupId;
</script>

<template>
    <fieldset :aria-invalid="props.error ? 'true' : undefined" :aria-describedby="props.error ? `${groupId}-note` : undefined" :disabled="props.disabled">
        <legend v-if="props.label" class="mb-2 text-sm font-medium text-ink">{{ props.label }}</legend>
        <div :class="props.inline ? 'flex flex-wrap gap-x-5 gap-y-2' : 'space-y-2'">
            <template v-for="option in props.options" :key="option.value">
                <p v-if="option.group" class="text-sm font-semibold text-ink" :style="{ paddingLeft: `${(option.depth ?? 0) * 1.25}rem` }" data-test="radio-group-heading">{{ option.label }}</p>
                <label
                    v-else
                    class="flex items-start gap-2.5 text-sm text-ink"
                    :class="option.disabled || props.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
                    :style="option.depth ? { paddingLeft: `${option.depth * 1.25}rem` } : undefined"
                >
                    <input
                        type="radio"
                        class="mt-0.5 h-4 w-4 shrink-0 border-line accent-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        :name="name"
                        :value="option.value"
                        :checked="option.value === props.modelValue"
                        :disabled="option.disabled"
                        @change="emit('update:modelValue', option.value)"
                    />
                    <span>
                        <span class="font-medium">{{ option.label }}</span>
                        <span v-if="option.description" class="block text-xs text-ink-muted">{{ option.description }}</span>
                    </span>
                </label>
            </template>
        </div>
        <UiFieldError v-if="props.error" :id="`${groupId}-note`" :message="props.error" class="mt-1.5" />
    </fieldset>
</template>
