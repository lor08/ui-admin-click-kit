<script setup lang="ts">
import UiFormField from './UiFormField.vue';
import { splitAttrs } from './attrs';
import { useAttrs } from 'vue';
import { controlBase, controlState } from './styles';

/** A multi-line text control; with a `label` it is the whole field, like UiInput. */
const props = withDefaults(
    defineProps<{
        modelValue: string;
        label?: string;
        hint?: string | null;
        error?: string | null;
        id?: string;
        name?: string;
        rows?: number;
        placeholder?: string;
        required?: boolean;
        optional?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        maxlength?: number;
    }>(),
    {
        label: undefined,
        hint: null,
        error: null,
        id: undefined,
        name: undefined,
        rows: 3,
        placeholder: undefined,
        required: false,
        optional: false,
        disabled: false,
        readonly: false,
        maxlength: undefined,
    },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

defineOptions({ inheritAttrs: false });

const { root: rootAttrs, control: controlAttrs } = splitAttrs(useAttrs());
</script>

<template>
    <UiFormField v-bind="rootAttrs" :label="props.label" :hint="props.hint" :error="props.error" :id="props.id" :required="props.required" :optional="props.optional" v-slot="field">
        <textarea
            v-bind="controlAttrs"
            :id="field.id"
            :class="[controlBase, controlState(field.invalid), 'px-3 py-2 text-sm leading-6']"
            :value="props.modelValue"
            :name="props.name"
            :rows="props.rows"
            :placeholder="props.placeholder"
            :required="props.required"
            :disabled="props.disabled"
            :readonly="props.readonly"
            :maxlength="props.maxlength"
            :aria-invalid="field.invalid ? 'true' : undefined"
            :aria-describedby="field.describedBy"
            @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        />
    </UiFormField>
</template>
