<script setup lang="ts">
import UiCheckbox from './UiCheckbox.vue';
import UiFieldError from './UiFieldError.vue';
import UiHelpText from './UiHelpText.vue';
import { useId } from 'vue';

export interface UiCheckboxOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}

/**
 * Several yes/no choices under one caption, saved as the list of picked
 * values: the roles of a user, the permissions of a role. The order of the
 * value is the order of the options, whatever the order of the clicks.
 */
const props = withDefaults(
    defineProps<{
        modelValue: string[];
        options: UiCheckboxOption[];
        label?: string;
        hint?: string | null;
        error?: string | null;
        columns?: 1 | 2 | 3;
        disabled?: boolean;
    }>(),
    { label: undefined, hint: null, error: null, columns: 1, disabled: false },
);

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>();

const groupId = useId();

const grids: Record<1 | 2 | 3, string> = { 1: 'space-y-2', 2: 'grid gap-2 sm:grid-cols-2', 3: 'grid gap-2 sm:grid-cols-2 lg:grid-cols-3' };

function toggle(value: string, checked: boolean): void {
    const picked = new Set(props.modelValue);
    if (checked) {
        picked.add(value);
    } else {
        picked.delete(value);
    }
    emit(
        'update:modelValue',
        props.options.map((option) => option.value).filter((candidate) => picked.has(candidate)),
    );
}
</script>

<template>
    <fieldset :aria-invalid="props.error ? 'true' : undefined" :aria-describedby="props.error || props.hint ? `${groupId}-note` : undefined" :disabled="props.disabled" data-test="checkbox-group">
        <legend v-if="props.label" class="mb-2 text-sm font-medium text-ink">{{ props.label }}</legend>
        <div :class="grids[props.columns]">
            <UiCheckbox
                v-for="option in props.options"
                :key="option.value"
                :model-value="props.modelValue.includes(option.value)"
                :label="option.label"
                :description="option.description ?? null"
                :disabled="props.disabled || option.disabled"
                :data-value="option.value"
                @update:model-value="(checked) => toggle(option.value, checked)"
            />
        </div>
        <UiFieldError v-if="props.error" :id="`${groupId}-note`" :message="props.error" class="mt-1.5" />
        <UiHelpText v-else-if="props.hint" :id="`${groupId}-note`" class="mt-1.5">{{ props.hint }}</UiHelpText>
    </fieldset>
</template>
