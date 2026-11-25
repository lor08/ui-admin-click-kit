<script setup lang="ts">
import { computed } from 'vue';

type Size = 'sm' | 'md' | 'lg';

/** The initials of a person in a circle; a picture when there is one. */
const props = withDefaults(defineProps<{ name: string; src?: string | null; size?: Size }>(), { src: null, size: 'md' });

const sizes: Record<Size, string> = { sm: 'h-7 w-7 text-[11px]', md: 'h-9 w-9 text-sm', lg: 'h-12 w-12 text-base' };

function initialsOf(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0];
    const last = parts[parts.length - 1];

    if (first === undefined) {
        return '?';
    }
    if (parts.length === 1) {
        return first.slice(0, 2).toUpperCase();
    }

    return `${first[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
}

const initials = computed(() => initialsOf(props.name));
</script>

<template>
    <span class="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-semibold text-brand-700" :class="sizes[props.size]" :title="props.name">
        <img v-if="props.src" :src="props.src" :alt="props.name" class="h-full w-full object-cover" />
        <span v-else aria-hidden="true">{{ initials }}</span>
        <span v-if="!props.src" class="sr-only">{{ props.name }}</span>
    </span>
</template>
