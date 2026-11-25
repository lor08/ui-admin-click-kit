<script setup lang="ts">
import UiFormField from './UiFormField.vue';
import { splitAttrs } from './attrs';
import { useAttrs } from 'vue';
import { controlBase, controlState } from './styles';

/**
 * A control that picks one file from the device; with a `label` it is the
 * whole field, like UiInput. The value is the picked File, or null.
 */
const props = withDefaults(
    defineProps<{
        modelValue: File | null;
        accept?: string;
        label?: string;
        hint?: string | null;
        error?: string | null;
        id?: string;
        name?: string;
        required?: boolean;
        optional?: boolean;
        disabled?: boolean;
    }>(),
    {
        accept: undefined,
        label: undefined,
        hint: null,
        error: null,
        id: undefined,
        name: undefined,
        required: false,
        optional: false,
        disabled: false,
    },
);

const emit = defineEmits<{ 'update:modelValue': [value: File | null] }>();

defineOptions({ inheritAttrs: false });

const { root: rootAttrs, control: controlAttrs } = splitAttrs(useAttrs());

function pick(event: Event): void {
    emit('update:modelValue', (event.target as HTMLInputElement).files?.item(0) ?? null);
}
</script>

<template>
    <UiFormField v-bind="rootAttrs" :label="props.label" :hint="props.hint" :error="props.error" :id="props.id" :required="props.required" :optional="props.optional" v-slot="field">
        <input
            v-bind="controlAttrs"
            :id="field.id"
            type="file"
            :class="[
                controlBase,
                controlState(field.invalid),
                'cursor-pointer px-1.5 py-1.5 text-sm text-ink-muted file:mr-3 file:cursor-pointer file:rounded-control file:border-0 file:bg-canvas file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-line',
            ]"
            :name="props.name"
            :accept="props.accept"
            :required="props.required"
            :disabled="props.disabled"
            :aria-invalid="field.invalid ? 'true' : undefined"
            :aria-describedby="field.describedBy"
            @change="pick"
        />
    </UiFormField>
</template>
