<script setup lang="ts">
import { TabsList, TabsRoot, TabsTrigger } from 'reka-ui';

export interface UiTab {
    value: string;
    label: string;
    count?: number | null;
    disabled?: boolean;
}

/**
 * Tabs over one screen's data: the active one is in `modelValue`, panels
 * are UiTabPanel children. Navigation between screens is a nav of links
 * in the sidebar, not tabs.
 */
const props = defineProps<{ tabs: UiTab[]; modelValue: string }>();

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
    <TabsRoot :model-value="props.modelValue" @update:model-value="(value) => emit('update:modelValue', String(value))">
        <TabsList class="flex gap-1 overflow-x-auto border-b border-line" data-test="tablist">
            <TabsTrigger
                v-for="tab in props.tabs"
                :key="tab.value"
                :value="tab.value"
                :disabled="tab.disabled"
                class="-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50 data-[state=active]:border-brand-600 data-[state=active]:text-brand-700"
            >
                {{ tab.label }}
                <span v-if="tab.count !== undefined && tab.count !== null" class="rounded-full bg-canvas px-1.5 text-xs text-ink-muted">{{ tab.count }}</span>
            </TabsTrigger>
        </TabsList>
        <slot />
    </TabsRoot>
</template>
