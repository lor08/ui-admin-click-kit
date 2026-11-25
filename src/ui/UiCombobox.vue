<script setup lang="ts" generic="T extends UiComboboxOption">
import UiSearchInput from './UiSearchInput.vue';
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';

export interface UiComboboxOption {
    key: string;
    /** A caption drawn above this option: the start of a group of options ("Address suggestions"). */
    heading?: string;
}

/**
 * A search box with a list of options under it: the text is bound at once,
 * `search` fires once typing pauses, the reader picks an option with the
 * pointer or the arrows and Enter, which takes the active one (the
 * first, or the first `prefer` passes). Enter does nothing while `loading`:
 * the options are not yet those of the text. The parent fetches the options and draws
 * each one in the `option` slot; `message` is a line above them (too
 * short, nothing found). Escape clears, a click outside closes.
 */
const props = withDefaults(
    defineProps<{
        modelValue: string;
        options: T[];
        label?: string;
        placeholder?: string;
        loading?: boolean;
        /** Milliseconds of silence before `search`. */
        debounce?: number;
        /** A line above the options: the text is too short, nothing was found. */
        message?: string | null;
        id?: string;
        /**
         * Which option is active when the options change, so Enter takes it:
         * the first that passes, else the first of all ("open the first
         * match found", not the "Create" row above it).
         */
        prefer?: (option: T) => boolean;
    }>(),
    { label: undefined, placeholder: undefined, loading: false, debounce: 250, message: null, id: undefined, prefer: undefined },
);

const emit = defineEmits<{ 'update:modelValue': [value: string]; search: [value: string]; select: [option: T] }>();

defineSlots<{ option(props: { option: T; active: boolean }): unknown }>();

const root = ref<HTMLElement | null>(null);
const open = ref(false);
const active = ref(-1);
const listId = useId();

const optionId = (option: T): string => `${listId}-${option.key}`;
const activeId = computed(() => {
    const option = active.value >= 0 ? props.options[active.value] : undefined;
    return option ? optionId(option) : undefined;
});

watch(
    () => props.modelValue,
    (value) => (open.value = value !== ''),
);
watch(
    () => props.options,
    (options) => {
        const preferred = props.prefer === undefined ? -1 : options.findIndex(props.prefer);
        active.value = preferred >= 0 ? preferred : options.length > 0 ? 0 : -1;
    },
    { immediate: true },
);

function pick(option: T): void {
    open.value = false;
    emit('select', option);
}

function onKey(event: KeyboardEvent): void {
    const count = props.options.length;
    if (!open.value || count === 0) {
        return;
    }
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        active.value = (active.value + 1) % count;
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        active.value = (active.value - 1 + count) % count;
    } else if (event.key === 'Enter' && active.value >= 0) {
        event.preventDefault();
        event.stopPropagation();
        if (props.loading) {
            return;
        }
        const option = props.options[active.value];
        if (option) {
            pick(option);
        }
    }
}

function onDocumentPointer(event: PointerEvent): void {
    if (root.value && !root.value.contains(event.target as Node)) {
        open.value = false;
    }
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointer));
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointer));
</script>

<template>
    <div ref="root" class="relative min-w-0" data-test="combobox">
        <UiSearchInput
            :id="props.id"
            :model-value="props.modelValue"
            :placeholder="props.placeholder"
            :label="props.label"
            :loading="props.loading"
            :debounce="props.debounce"
            role="combobox"
            :aria-expanded="open ? 'true' : 'false'"
            :aria-controls="listId"
            :aria-activedescendant="activeId"
            aria-autocomplete="list"
            @update:model-value="(value: string) => emit('update:modelValue', value)"
            @search="(value: string) => emit('search', value)"
            @clear="open = false"
            @keydown.capture="onKey"
            @focusin="open = props.modelValue !== ''"
        />
        <div
            v-show="open && (props.options.length > 0 || props.message)"
            :id="listId"
            class="absolute left-0 top-full z-40 mt-1 w-full min-w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-card border border-line bg-surface shadow-lg"
            role="listbox"
            :aria-label="props.label ?? props.placeholder"
            data-test="combobox-list"
        >
            <p v-if="props.message" class="px-3 py-2 text-sm text-ink-muted" data-test="combobox-message">{{ props.message }}</p>
            <ul v-if="props.options.length > 0" class="max-h-96 overflow-y-auto py-1">
                <template v-for="(option, index) in props.options" :key="option.key">
                    <li v-if="option.heading" role="presentation" class="border-t border-line px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-ink-muted first:border-t-0">{{ option.heading }}</li>
                    <li
                        :id="optionId(option)"
                        role="option"
                        :aria-selected="index === active ? 'true' : 'false'"
                        class="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm"
                        :class="index === active ? 'bg-brand-50' : 'hover:bg-canvas'"
                        data-test="combobox-option"
                        @pointerdown.prevent
                        @click="pick(option)"
                        @mousemove="active = index"
                    >
                        <slot name="option" :option="option" :active="index === active" />
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
