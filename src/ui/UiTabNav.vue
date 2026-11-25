<script setup lang="ts">
import { kitLink } from './kit';
import type { Component } from 'vue';

export interface UiTabNavItem {
    key: string;
    label: string;
    href: string;
    /** A figure after the label (members, tasks, files); none draws nothing. */
    count?: number | null;
    icon?: Component;
}

/**
 * The tabs of one record when each tab is its own address: a link per tab
 * with its icon
 * and its figure, the current one marked. A column beside the record from
 * the large breakpoint, a row that scrolls above it on a narrow screen.
 * Tabs inside one screen without an address are UiTabs.
 */
const props = withDefaults(defineProps<{ items: UiTabNavItem[]; current: string; label: string }>(), {});

const link = kitLink();
</script>

<template>
    <nav :aria-label="props.label" data-test="tab-nav">
        <ul class="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            <li v-for="item in props.items" :key="item.key" class="shrink-0">
                <component
                    :is="link"
                    :href="item.href"
                    :aria-current="item.key === props.current ? 'page' : undefined"
                    class="flex items-center gap-2 rounded-control border px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                    :class="item.key === props.current ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink'"
                    :data-test="`tab-${item.key}`"
                >
                    <component :is="item.icon" v-if="item.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span class="grow">{{ item.label }}</span>
                    <span v-if="item.count !== undefined && item.count !== null" class="rounded-full bg-canvas px-1.5 text-xs tabular-nums text-ink-muted" data-test="tab-count">{{ item.count }}</span>
                </component>
            </li>
        </ul>
    </nav>
</template>
