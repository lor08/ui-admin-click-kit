<script setup lang="ts">
import UiButton from './UiButton.vue';
import UiFormField from './UiFormField.vue';
import type { UiSelectOption } from './UiSelect.vue';
import { splitAttrs } from './attrs';
import { controlBase, controlSizes, controlState } from './styles';
import { useTrans } from './kit';
import { Check, ChevronDown } from '@lucide/vue';
import { ListboxContent, ListboxFilter, ListboxItem, ListboxItemIndicator, ListboxRoot, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger, type AcceptableValue } from 'reka-ui';
import { computed, ref, useAttrs, watch } from 'vue';

/**
 * Several choices out of a list, behind a trigger that reads like a select:
 * the picked labels (the first two and how many more), the placeholder
 * while nothing is picked. The list opens in a popover with a checkbox per
 * option, a filter box on top when `searchable` and Clear at the bottom.
 * With a `label` it is the whole field, like UiSelect.
 */
const props = withDefaults(
    defineProps<{
        modelValue: string[];
        options: UiSelectOption[];
        label?: string;
        hint?: string | null;
        error?: string | null;
        id?: string;
        /** What the trigger says while nothing is picked ("All lines"). */
        placeholder?: string;
        searchable?: boolean;
        disabled?: boolean;
    }>(),
    { label: undefined, hint: null, error: null, id: undefined, placeholder: undefined, searchable: false, disabled: false },
);

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>();

defineOptions({ inheritAttrs: false });

const { root: rootAttrs, control: controlAttrs } = splitAttrs(useAttrs());

const t = useTrans();
const open = ref(false);
const query = ref('');

watch(open, (isOpen) => {
    if (!isOpen) {
        query.value = '';
    }
});

const picked = computed(() => props.options.filter((option) => props.modelValue.includes(option.value)));

const summary = computed((): string => {
    if (picked.value.length === 0) {
        return props.placeholder ?? t('ui.multi_select.any');
    }
    const shown = picked.value.slice(0, 2).map((option) => option.label).join(', ');
    const rest = picked.value.length - 2;

    return rest > 0 ? `${shown} ${t('ui.multi_select.more', { count: rest })}` : shown;
});

const visible = computed(() => {
    const needle = query.value.trim().toLocaleLowerCase();

    return needle === '' ? props.options : props.options.filter((option) => option.label.toLocaleLowerCase().includes(needle));
});

/** In the order of the options, whatever order they were picked in, so the value is stable for a URL or a request. */
function pick(value: AcceptableValue): void {
    const values = Array.isArray(value) ? value.map(String) : [];
    emit(
        'update:modelValue',
        props.options.filter((option) => values.includes(option.value)).map((option) => option.value),
    );
}
</script>

<template>
    <UiFormField v-bind="rootAttrs" :label="props.label" :hint="props.hint" :error="props.error" :id="props.id" v-slot="field">
        <PopoverRoot v-model:open="open">
            <PopoverTrigger as-child>
                <button
                    v-bind="controlAttrs"
                    :id="field.id"
                    type="button"
                    :class="[controlBase, controlSizes.md, controlState(field.invalid), 'relative flex items-center pr-9 text-left']"
                    :disabled="props.disabled"
                    :aria-label="props.label !== undefined ? `${props.label}: ${summary}` : undefined"
                    :aria-invalid="field.invalid ? 'true' : undefined"
                    :aria-describedby="field.describedBy"
                    data-test="multi-select-trigger"
                >
                    <span class="min-w-0 truncate" :class="picked.length === 0 ? 'text-ink-subtle' : ''">{{ summary }}</span>
                    <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
                </button>
            </PopoverTrigger>
            <PopoverPortal>
                <PopoverContent
                    align="start"
                    :side-offset="4"
                    class="z-50 w-[var(--reka-popover-trigger-width)] min-w-56 max-w-[calc(100vw-2rem)] rounded-control border border-line bg-surface shadow-lg focus:outline-none"
                    data-test="multi-select-content"
                >
                    <ListboxRoot :model-value="props.modelValue" multiple highlight-on-hover @update:model-value="pick">
                        <div v-if="props.searchable" class="border-b border-line p-2">
                            <ListboxFilter
                                v-model="query"
                                auto-focus
                                :class="[controlBase, controlSizes.sm, controlState(false)]"
                                :placeholder="t('ui.multi_select.filter')"
                                :aria-label="t('ui.multi_select.filter')"
                                data-test="multi-select-filter"
                            />
                        </div>
                        <ListboxContent class="max-h-64 overflow-y-auto p-1 focus:outline-none" :aria-label="props.label">
                            <ListboxItem
                                v-for="option in visible"
                                :key="option.value"
                                :value="option.value"
                                :disabled="option.disabled"
                                class="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-ink outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[highlighted]:bg-canvas"
                                data-test="multi-select-option"
                            >
                                <span class="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-line-strong bg-surface" aria-hidden="true">
                                    <ListboxItemIndicator><Check class="h-3 w-3 text-brand-600" /></ListboxItemIndicator>
                                </span>
                                <span class="min-w-0 truncate">{{ option.label }}</span>
                            </ListboxItem>
                            <p v-if="visible.length === 0" class="px-2 py-3 text-center text-sm text-ink-muted" data-test="multi-select-none">{{ t('ui.multi_select.none') }}</p>
                        </ListboxContent>
                    </ListboxRoot>
                    <div v-if="picked.length > 0" class="flex justify-end border-t border-line p-1">
                        <UiButton variant="ghost" size="sm" data-test="multi-select-clear" @click="emit('update:modelValue', [])">{{ t('ui.clear') }}</UiButton>
                    </div>
                </PopoverContent>
            </PopoverPortal>
        </PopoverRoot>
    </UiFormField>
</template>
