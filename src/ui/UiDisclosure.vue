<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui';

/**
 * A block that opens and closes under its own title, as a screen hides a
 * secondary table in `<details>`. Closed by default unless `defaultOpen`; `update:open`
 * tells the parent when it changes. The `meta` slot sits beside the title
 * (a count, a badge) and stays visible while closed.
 */
const props = withDefaults(defineProps<{ title: string; lead?: string | null; defaultOpen?: boolean }>(), { lead: null, defaultOpen: false });

const emit = defineEmits<{ 'update:open': [open: boolean] }>();
</script>

<template>
    <CollapsibleRoot :default-open="props.defaultOpen" class="rounded-card border border-line bg-surface" data-test="disclosure" @update:open="(value: boolean) => emit('update:open', value)">
        <CollapsibleTrigger
            class="group flex w-full items-start justify-between gap-3 rounded-card px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            data-test="disclosure-trigger"
        >
            <span class="min-w-0">
                <span class="flex flex-wrap items-center gap-2">
                    <span class="text-base font-semibold text-ink">{{ props.title }}</span>
                    <slot name="meta" />
                </span>
                <span v-if="props.lead" class="mt-1 block text-sm text-ink-muted">{{ props.lead }}</span>
            </span>
            <ChevronDown class="mt-0.5 h-5 w-5 shrink-0 text-ink-subtle transition-transform group-data-[state=open]:rotate-180" aria-hidden="true" />
        </CollapsibleTrigger>
        <CollapsibleContent class="px-5 pb-5" data-test="disclosure-content">
            <slot />
        </CollapsibleContent>
    </CollapsibleRoot>
</template>
