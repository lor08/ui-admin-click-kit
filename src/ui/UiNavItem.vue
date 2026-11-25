<script setup lang="ts">
import { kitLink, kitPath } from './kit';
import { computed, type Component } from 'vue';

/**
 * One line of the dark sidebar: a screen to open (`href`) or an action (no
 * `href`, the parent gets `click`). It is the current one while the page's
 * path is `activePrefix` or lies under it.
 */
const props = withDefaults(defineProps<{ label: string; icon: Component; href?: string; activePrefix?: string }>(), { href: undefined, activePrefix: undefined });

const emit = defineEmits<{ click: [] }>();

const link = kitLink();

const active = computed(() => {
    const path = kitPath();

    return props.activePrefix !== undefined && (path === props.activePrefix || path.startsWith(`${props.activePrefix}/`));
});

const classes = computed(() => [
    'flex w-full items-center gap-3 rounded-control px-3 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/70',
    active.value ? 'bg-sidebar-active text-white' : 'text-sidebar-ink hover:bg-sidebar-hover hover:text-white',
]);
</script>

<template>
    <component :is="link" v-if="props.href !== undefined" :href="props.href" :class="classes" :aria-current="active ? 'page' : undefined">
        <component :is="props.icon" class="h-5 w-5 shrink-0" aria-hidden="true" />
        <span class="truncate">{{ props.label }}</span>
    </component>
    <button v-else type="button" :class="classes" @click="emit('click')">
        <component :is="props.icon" class="h-5 w-5 shrink-0" aria-hidden="true" />
        <span class="truncate">{{ props.label }}</span>
    </button>
</template>
