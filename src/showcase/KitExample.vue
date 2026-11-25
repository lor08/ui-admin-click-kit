<script setup lang="ts">
import KitApi from './KitApi.vue';
import KitSnippet from './KitSnippet.vue';
import type { KitEntry } from './manifest';
import { useTrans } from './words';

/**
 * One component of the section, from its manifest entry: what it is for,
 * when to reach for it, the live example (the demo component in the slot),
 * the snippet to copy and the table of props, slots and events.
 */
const props = defineProps<{ entry: KitEntry }>();

const t = useTrans();
</script>

<template>
    <section :id="props.entry.name" class="scroll-mt-20 rounded-card border border-line bg-surface" :data-test="`kit-${props.entry.name}`">
        <header class="border-b border-line px-5 py-4">
            <h2 class="font-mono text-base font-semibold text-ink">{{ props.entry.name }}</h2>
            <p v-if="props.entry.partOf" class="mt-0.5 text-xs text-ink-muted">{{ t('ui_kit.example.part_of', { parent: props.entry.partOf }) }}</p>
            <p class="mt-2 text-sm font-medium text-ink">{{ t(`ui_kit.components.${props.entry.name}.purpose`) }}</p>
            <p class="mt-1 text-sm text-ink-muted">{{ t(`ui_kit.components.${props.entry.name}.when`) }}</p>
        </header>
        <div class="grid gap-6 px-5 py-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div v-if="$slots.default" class="min-w-0">
                <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">{{ t('ui_kit.example.live') }}</p>
                <slot />
            </div>
            <div class="min-w-0">
                <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">{{ t('ui_kit.example.snippet') }}</p>
                <KitSnippet :code="props.entry.snippet" />
            </div>
        </div>
        <div class="border-t border-line px-5 py-4">
            <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">{{ t('ui_kit.example.api') }}</p>
            <KitApi :entry="props.entry" />
        </div>
    </section>
</template>
