<script setup lang="ts">
import { kitLink } from './kit';
import { computed } from 'vue';

/**
 * A small rounded label the reader can pick: a section of a page, a
 * filter token, an anchor further down. `active` marks the current one.
 * With `href` it navigates (the app's link, or a plain anchor for a
 * hash); without it, it is a button that emits `select`.
 */
const props = withDefaults(defineProps<{ href?: string; active?: boolean; mono?: boolean; disabled?: boolean }>(), {
    href: undefined,
    active: false,
    mono: false,
    disabled: false,
});

const emit = defineEmits<{ select: [] }>();

const classes = computed(() => [
    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
    props.mono ? 'font-mono' : '',
    props.active ? 'border-brand-600 bg-brand-600 text-white' : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink',
    props.disabled ? 'cursor-not-allowed opacity-50' : '',
]);

const link = kitLink();

const anchor = computed(() => props.href !== undefined && props.href.startsWith('#'));
</script>

<template>
    <a v-if="anchor" :href="props.href" :class="classes" :aria-current="props.active ? 'true' : undefined"><slot /></a>
    <component :is="link" v-else-if="props.href" :href="props.href" :class="classes" :aria-current="props.active ? 'page' : undefined"><slot /></component>
    <button v-else type="button" :class="classes" :aria-pressed="props.active ? 'true' : 'false'" :disabled="props.disabled" @click="emit('select')"><slot /></button>
</template>
