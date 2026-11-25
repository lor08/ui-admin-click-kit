<script setup lang="ts">
import { Inbox } from '@lucide/vue';

/** What a list says when there is nothing in it, with the one thing to do about it. */
withDefaults(defineProps<{ title: string; description?: string | null; size?: 'sm' | 'md' }>(), { description: null, size: 'md' });
</script>

<template>
    <div class="flex flex-col items-center text-center" :class="size === 'sm' ? 'px-4 py-6' : 'px-6 py-12'" data-test="empty-state">
        <span class="flex items-center justify-center rounded-full bg-canvas text-ink-subtle" :class="size === 'sm' ? 'h-9 w-9 [&>svg]:h-4 [&>svg]:w-4' : 'h-12 w-12 [&>svg]:h-6 [&>svg]:w-6'">
            <slot name="icon"><Inbox aria-hidden="true" /></slot>
        </span>
        <p class="mt-3 font-medium text-ink" :class="size === 'sm' ? 'text-sm' : 'text-base'">{{ title }}</p>
        <p v-if="description" class="mt-1 max-w-sm text-sm text-ink-muted">{{ description }}</p>
        <div v-if="$slots.action" class="mt-4"><slot name="action" /></div>
    </div>
</template>
