<script setup lang="ts">
import UiFieldError from './UiFieldError.vue';
import UiHelpText from './UiHelpText.vue';
import UiLabel from './UiLabel.vue';
import { provideField } from './field';
import { computed } from 'vue';

/**
 * Label + control + help text + error, wired with ids: the control inside
 * reads them from the field (see field.ts) or from the slot props. The
 * error wins over the hint, as one line is enough under a control.
 */
const props = withDefaults(
    defineProps<{
        label?: string;
        hint?: string | null;
        error?: string | null;
        /** The control's id, when a test or autofill refers to it; generated otherwise. */
        id?: string;
        required?: boolean;
        optional?: boolean;
    }>(),
    { label: undefined, hint: null, error: null, id: undefined, required: false, optional: false },
);

const field = provideField({
    id: computed(() => props.id),
    hasLabel: computed(() => props.label !== undefined),
    hasNote: computed(() => Boolean(props.error) || Boolean(props.hint)),
    invalid: computed(() => Boolean(props.error)),
});

const noteId = computed(() => `${field.id}-note`);
</script>

<template>
    <div>
        <UiLabel v-if="props.label !== undefined" :for="field.id" :required="props.required" :optional="props.optional" class="mb-1.5">
            {{ props.label }}
        </UiLabel>
        <slot :id="field.id" :described-by="field.describedBy.value" :invalid="field.invalid.value" />
        <UiFieldError v-if="props.error" :id="noteId" :message="props.error" class="mt-1.5" />
        <UiHelpText v-else-if="props.hint" :id="noteId" class="mt-1.5">{{ props.hint }}</UiHelpText>
    </div>
</template>
