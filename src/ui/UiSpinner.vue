<script setup lang="ts">
import { useTrans } from './kit';
import { computed } from 'vue';

type Size = 'xs' | 'sm' | 'md' | 'lg';

const props = withDefaults(defineProps<{ size?: Size; label?: string }>(), { size: 'md', label: undefined });

const t = useTrans();

const sizes: Record<Size, string> = { xs: 'h-3 w-3', sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-8 w-8' };

const label = computed(() => props.label ?? t('ui.loading'));
</script>

<template>
    <span role="status" :aria-label="label" class="inline-flex shrink-0">
        <svg class="animate-spin text-current" :class="sizes[props.size]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
            <path class="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z" />
        </svg>
    </span>
</template>
