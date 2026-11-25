<script setup lang="ts">
/** A bordered surface with an optional heading row; `padding="none"` lets a table fill it edge to edge. */
withDefaults(defineProps<{ title?: string | null; lead?: string | null; padding?: 'md' | 'none' }>(), { title: null, lead: null, padding: 'md' });
</script>

<template>
    <section class="rounded-card border border-line bg-surface">
        <header v-if="title || lead || $slots.actions" class="flex flex-wrap items-start justify-between gap-3 px-5 pt-5" :class="padding === 'none' ? 'pb-4' : ''">
            <div class="min-w-0">
                <h2 v-if="title" class="text-base font-semibold text-ink">{{ title }}</h2>
                <p v-if="lead" class="mt-1 text-sm text-ink-muted">{{ lead }}</p>
            </div>
            <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2"><slot name="actions" /></div>
        </header>
        <div :class="padding === 'none' ? '' : title || lead || $slots.actions ? 'px-5 pb-5 pt-4' : 'p-5'">
            <slot />
        </div>
        <footer v-if="$slots.footer" class="border-t border-line px-5 py-3"><slot name="footer" /></footer>
    </section>
</template>
