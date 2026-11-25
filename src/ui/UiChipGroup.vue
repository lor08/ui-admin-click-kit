<script setup lang="ts">
import UiChip from './UiChip.vue';
import UiFieldError from './UiFieldError.vue';
import UiHelpText from './UiHelpText.vue';
import { useId } from 'vue';

export interface UiChipOption {
    value: string;
    label: string;
    disabled?: boolean;
}

/**
 * One choice out of a row of chips: a type, a priority, a size. Picking
 * the chosen chip again clears the choice, unless the choice
 * is `mandatory`.
 */
const props = withDefaults(
    defineProps<{
        modelValue: string | null;
        options: UiChipOption[];
        label?: string;
        hint?: string | null;
        error?: string | null;
        mandatory?: boolean;
        disabled?: boolean;
    }>(),
    { label: undefined, hint: null, error: null, mandatory: false, disabled: false },
);

const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>();

const groupId = useId();

function pick(value: string): void {
    if (value === props.modelValue) {
        if (!props.mandatory) {
            emit('update:modelValue', null);
        }

        return;
    }
    emit('update:modelValue', value);
}
</script>

<template>
    <fieldset :aria-invalid="props.error ? 'true' : undefined" :aria-describedby="props.error || props.hint ? `${groupId}-note` : undefined" :disabled="props.disabled">
        <legend v-if="props.label" class="mb-2 text-sm font-medium text-ink">{{ props.label }}</legend>
        <div class="flex flex-wrap gap-2">
            <UiChip
                v-for="option in props.options"
                :key="option.value"
                :active="option.value === props.modelValue"
                :disabled="props.disabled || option.disabled"
                :data-value="option.value"
                @select="pick(option.value)"
            >
                {{ option.label }}
            </UiChip>
        </div>
        <UiFieldError v-if="props.error" :id="`${groupId}-note`" :message="props.error" class="mt-1.5" />
        <UiHelpText v-else-if="props.hint" :id="`${groupId}-note`" class="mt-1.5">{{ props.hint }}</UiHelpText>
    </fieldset>
</template>
