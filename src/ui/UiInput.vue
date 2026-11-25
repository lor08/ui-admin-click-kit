<script setup lang="ts">
import UiFormField from './UiFormField.vue';
import { controlBase, controlSizes, controlState, type ControlSize } from './styles';
import { splitAttrs } from './attrs';
import { computed, useAttrs } from 'vue';

/**
 * A single-line text control. Given a `label` (or hint, or error) it is the
 * whole field: UiFormField around the input. Without them it is the bare control, for a
 * UiFormField of the page or a toolbar.
 */
const props = withDefaults(
    defineProps<{
        modelValue: string;
        label?: string;
        hint?: string | null;
        error?: string | null;
        /** An explicit id where tests and autofill refer to the field. */
        id?: string;
        type?: string;
        size?: ControlSize;
        name?: string;
        autocomplete?: string;
        placeholder?: string;
        required?: boolean;
        optional?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        autofocus?: boolean;
        /** Marks the control invalid without a message, when the message is shown elsewhere. */
        invalid?: boolean;
        min?: string | number;
        max?: string | number;
        step?: string | number;
        maxlength?: number;
        inputmode?: 'text' | 'numeric' | 'tel' | 'email' | 'decimal' | 'search' | 'url';
    }>(),
    {
        label: undefined,
        hint: null,
        error: null,
        id: undefined,
        type: 'text',
        size: 'md',
        name: undefined,
        autocomplete: undefined,
        placeholder: undefined,
        required: false,
        optional: false,
        disabled: false,
        readonly: false,
        autofocus: false,
        invalid: false,
        min: undefined,
        max: undefined,
        step: undefined,
        maxlength: undefined,
        inputmode: undefined,
    },
);

const emit = defineEmits<{ 'update:modelValue': [value: string]; blur: [event: FocusEvent]; keydown: [event: KeyboardEvent] }>();

defineOptions({ inheritAttrs: false });

// `class` and `style` dress the field, anything else (aria-*, data-*, name of a form) belongs to the control.
const { root: rootAttrs, control: controlAttrs } = splitAttrs(useAttrs());

const slots = defineSlots<{ leading?: () => unknown; trailing?: () => unknown }>();

function classes(invalid: boolean): string[] {
    return [
        controlBase,
        controlSizes[props.size],
        controlState(invalid || props.invalid),
        slots.leading ? 'pl-9' : '',
        slots.trailing ? 'pr-9' : '',
    ];
}

const iconBox = computed(() => 'pointer-events-none absolute inset-y-0 flex items-center text-ink-muted [&>svg]:h-4 [&>svg]:w-4');
</script>

<template>
    <UiFormField v-bind="rootAttrs" :label="props.label" :hint="props.hint" :error="props.error" :id="props.id" :required="props.required" :optional="props.optional" v-slot="field">
        <div class="relative">
            <span v-if="slots.leading" :class="[iconBox, 'left-3']"><slot name="leading" /></span>
            <input
                v-bind="controlAttrs"
                :id="field.id"
                :class="classes(field.invalid)"
                :value="props.modelValue"
                :type="props.type"
                :name="props.name"
                :autocomplete="props.autocomplete"
                :placeholder="props.placeholder"
                :required="props.required"
                :disabled="props.disabled"
                :readonly="props.readonly"
                :autofocus="props.autofocus"
                :min="props.min"
                :max="props.max"
                :step="props.step"
                :maxlength="props.maxlength"
                :inputmode="props.inputmode"
                :aria-invalid="field.invalid || props.invalid ? 'true' : undefined"
                :aria-describedby="field.describedBy"
                @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
                @blur="emit('blur', $event)"
                @keydown="emit('keydown', $event)"
            />
            <span v-if="slots.trailing" :class="[iconBox, 'right-3']"><slot name="trailing" /></span>
        </div>
    </UiFormField>
</template>
