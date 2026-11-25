<script setup lang="ts">
import UiInput from './UiInput.vue';
import UiSpinner from './UiSpinner.vue';
import { useTrans } from './kit';
import { Search, X } from 'lucide-vue-next';
import { onBeforeUnmount, useAttrs, watch } from 'vue';
import { splitAttrs } from './attrs';
import type { ControlSize } from './styles';

/**
 * A search box: the value is bound at once, `search` fires once typing
 * pauses (or on Enter), the cross clears it. Loading shows a spinner where
 * the cross was.
 */
const props = withDefaults(
    defineProps<{
        modelValue: string;
        placeholder?: string;
        label?: string;
        size?: ControlSize;
        loading?: boolean;
        /** Milliseconds of silence before `search`; 0 fires on every keystroke. */
        debounce?: number;
        autofocus?: boolean;
        id?: string;
    }>(),
    { placeholder: undefined, label: undefined, size: 'md', loading: false, debounce: 300, autofocus: false, id: undefined },
);

const emit = defineEmits<{ 'update:modelValue': [value: string]; search: [value: string]; clear: [] }>();

const t = useTrans();

defineOptions({ inheritAttrs: false });

// `class` dresses the box; aria-* and the like describe the input (a combobox over it, say).
const { root: rootAttrs, control: controlAttrs } = splitAttrs(useAttrs());

let timer: ReturnType<typeof setTimeout> | undefined;

function cancel(): void {
    if (timer) {
        clearTimeout(timer);
        timer = undefined;
    }
}

function fire(): void {
    cancel();
    emit('search', props.modelValue.trim());
}

watch(
    () => props.modelValue,
    () => {
        cancel();
        if (props.debounce === 0) {
            fire();
        } else {
            timer = setTimeout(fire, props.debounce);
        }
    },
);

function clear(): void {
    cancel();
    emit('update:modelValue', '');
    emit('clear');
}

function onKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
        event.preventDefault();
        fire();
    } else if (event.key === 'Escape' && props.modelValue !== '') {
        clear();
    }
}

onBeforeUnmount(cancel);
</script>

<template>
    <div class="relative" role="search" v-bind="rootAttrs">
        <UiInput
            v-bind="controlAttrs"
            :id="props.id"
            :model-value="props.modelValue"
            type="search"
            :size="props.size"
            :placeholder="props.placeholder ?? t('ui.search')"
            :autofocus="props.autofocus"
            autocomplete="off"
            :aria-label="props.label ?? props.placeholder ?? t('ui.search')"
            class="[&_input]:pr-9 [&_input::-webkit-search-cancel-button]:hidden"
            @update:model-value="emit('update:modelValue', $event)"
            @keydown="onKey"
        >
            <template #leading><Search /></template>
        </UiInput>
        <span v-if="props.loading" class="absolute inset-y-0 right-3 flex items-center text-ink-muted"><UiSpinner size="sm" /></span>
        <button
            v-else-if="props.modelValue !== ''"
            type="button"
            class="absolute inset-y-0 right-2 my-auto flex h-6 w-6 items-center justify-center rounded text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-brand-600"
            :aria-label="t('ui.clear')"
            data-test="clear"
            @click="clear"
        >
            <X class="h-4 w-4" aria-hidden="true" />
        </button>
    </div>
</template>
