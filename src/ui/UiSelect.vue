<script setup lang="ts">
import UiFormField from './UiFormField.vue';
import { splitAttrs } from './attrs';
import { useAttrs } from 'vue';
import { controlBase, controlSizes, controlState, type ControlSize } from './styles';
import { ChevronDown } from '@lucide/vue';

export interface UiSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

/** A native select over a fixed list of options; with a `label` it is the whole field, like UiInput. */
const props = withDefaults(
    defineProps<{
        modelValue: string;
        options: UiSelectOption[];
        label?: string;
        hint?: string | null;
        error?: string | null;
        id?: string;
        name?: string;
        size?: ControlSize;
        /** The first, empty choice; omitted when every value is a real option. */
        placeholder?: string;
        required?: boolean;
        optional?: boolean;
        disabled?: boolean;
        invalid?: boolean;
    }>(),
    {
        label: undefined,
        hint: null,
        error: null,
        id: undefined,
        name: undefined,
        size: 'md',
        placeholder: undefined,
        required: false,
        optional: false,
        disabled: false,
        invalid: false,
    },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

defineOptions({ inheritAttrs: false });

const { root: rootAttrs, control: controlAttrs } = splitAttrs(useAttrs());
</script>

<template>
    <UiFormField v-bind="rootAttrs" :label="props.label" :hint="props.hint" :error="props.error" :id="props.id" :required="props.required" :optional="props.optional" v-slot="field">
        <div class="relative">
            <select
                v-bind="controlAttrs"
                :id="field.id"
                :class="[controlBase, controlSizes[props.size], controlState(field.invalid || props.invalid), 'appearance-none pr-9']"
                :value="props.modelValue"
                :name="props.name"
                :required="props.required"
                :disabled="props.disabled"
                :aria-invalid="field.invalid || props.invalid ? 'true' : undefined"
                :aria-describedby="field.describedBy"
                @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
            >
                <option v-if="props.placeholder !== undefined" value="">{{ props.placeholder }}</option>
                <option v-for="option in props.options" :key="option.value" :value="option.value" :disabled="option.disabled">{{ option.label }}</option>
            </select>
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
        </div>
    </UiFormField>
</template>
