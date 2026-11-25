<script setup lang="ts">
import { useTrans } from './kit';
import { kitLink } from './kit';
import { ChevronRight } from 'lucide-vue-next';

export interface UiBreadcrumb {
    label: string;
    href?: string;
}

/** Where the reader is: every crumb but the last is a link. */
const props = defineProps<{ items: UiBreadcrumb[] }>();

const t = useTrans();
const link = kitLink();
</script>

<template>
    <nav :aria-label="t('ui.breadcrumbs')" data-test="breadcrumbs">
        <ol class="flex flex-wrap items-center gap-1 text-sm text-ink-muted">
            <li v-for="(item, index) in props.items" :key="`${item.label}-${index}`" class="flex items-center gap-1">
                <ChevronRight v-if="index > 0" class="h-3.5 w-3.5 text-ink-subtle" aria-hidden="true" />
                <component :is="link" v-if="item.href && index < props.items.length - 1" :href="item.href" class="rounded hover:text-ink focus-visible:outline-2 focus-visible:outline-brand-600">{{ item.label }}</component>
                <span v-else :aria-current="index === props.items.length - 1 ? 'page' : undefined" :class="index === props.items.length - 1 ? 'text-ink' : ''">{{ item.label }}</span>
            </li>
        </ol>
    </nav>
</template>
