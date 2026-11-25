<script setup lang="ts">
import { useId } from 'vue';

/** An on/off setting that applies at once, where a checkbox would wait for a Save. */
const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        label: string;
        id?: string;
        description?: string | null;
        disabled?: boolean;
    }>(),
    { id: undefined, description: null, disabled: false },
);

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const fallbackId = useId();
const switchId = props.id ?? fallbackId;

function toggle(): void {
    if (!props.disabled) {
        emit('update:modelValue', !props.modelValue);
    }
}
</script>

<template>
    <div class="flex items-start gap-3">
        <button
            :id="switchId"
            type="button"
            role="switch"
            :aria-checked="props.modelValue ? 'true' : 'false'"
            :aria-labelledby="`${switchId}-label`"
            :aria-describedby="props.description ? `${switchId}-note` : undefined"
            :disabled="props.disabled"
            class="relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            :class="props.modelValue ? 'bg-brand-600' : 'bg-line-strong'"
            @click="toggle"
        >
            <span class="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform" :class="props.modelValue ? 'translate-x-4' : 'translate-x-0.5'" aria-hidden="true" />
        </button>
        <span class="text-sm text-ink" :class="props.disabled ? 'opacity-60' : ''">
            <span :id="`${switchId}-label`" class="block cursor-pointer font-medium" @click="toggle">{{ props.label }}</span>
            <span v-if="props.description" :id="`${switchId}-note`" class="block text-xs text-ink-muted">{{ props.description }}</span>
        </span>
    </div>
</template>
