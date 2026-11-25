<script setup lang="ts">
import UiBreadcrumbs, { type UiBreadcrumb } from './UiBreadcrumbs.vue';

/**
 * The top of every screen: crumbs, the title, a line under it, the
 * actions on the right. Pages own it (the layout persists across
 * navigation), so it sits first inside the page's content.
 */
withDefaults(defineProps<{ title: string; lead?: string | null; breadcrumbs?: UiBreadcrumb[] }>(), { lead: null, breadcrumbs: () => [] });
</script>

<template>
    <header class="mb-6" data-test="page-header">
        <UiBreadcrumbs v-if="breadcrumbs.length > 0" :items="breadcrumbs" class="mb-2" />
        <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div class="min-w-0">
                <h1 class="text-2xl font-semibold tracking-tight text-ink">{{ title }}</h1>
                <p v-if="lead" class="mt-1 text-sm text-ink-muted">{{ lead }}</p>
                <div v-if="$slots.meta" class="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-muted"><slot name="meta" /></div>
            </div>
            <div v-if="$slots.actions" class="flex max-w-full shrink-0 flex-wrap items-center gap-2" data-test="actions"><slot name="actions" /></div>
        </div>
        <slot />
    </header>
</template>
