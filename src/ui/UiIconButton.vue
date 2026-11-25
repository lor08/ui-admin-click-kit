<script setup lang="ts">
import { kitLink } from './kit';
import { computed } from 'vue';

type Variant = 'ghost' | 'secondary' | 'primary' | 'danger';
type Size = 'sm' | 'md';

/** A square button holding one icon; the label is what a screen reader and the tooltip say. */
const props = withDefaults(
    defineProps<{
        label: string;
        variant?: Variant;
        size?: Size;
        href?: string;
        type?: 'button' | 'submit';
        disabled?: boolean;
        /** Marks the button pressed, for a toggle. */
        pressed?: boolean;
    }>(),
    { variant: 'ghost', size: 'md', href: undefined, type: 'button', disabled: false, pressed: undefined },
);

const variants: Record<Variant, string> = {
    ghost: 'text-ink-muted hover:bg-canvas hover:text-ink aria-pressed:bg-brand-50 aria-pressed:text-brand-700',
    secondary: 'border border-line bg-surface text-ink hover:bg-canvas',
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    danger: 'text-danger hover:bg-danger-surface',
};

const sizes: Record<Size, string> = { sm: 'h-8 w-8 [&>svg]:h-4 [&>svg]:w-4', md: 'h-9 w-9 [&>svg]:h-5 [&>svg]:w-5' };

const classes = computed(() => [
    'inline-flex shrink-0 items-center justify-center rounded-control transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
    'disabled:cursor-not-allowed disabled:opacity-50',
    sizes[props.size],
    variants[props.variant],
]);

const link = kitLink();
</script>

<template>
    <component :is="link" v-if="props.href" :class="classes" :href="props.href" :aria-label="props.label" :title="props.label">
        <slot />
    </component>
    <button
        v-else
        :class="classes"
        :type="props.type"
        :disabled="props.disabled"
        :aria-label="props.label"
        :title="props.label"
        :aria-pressed="props.pressed === undefined ? undefined : props.pressed ? 'true' : 'false'"
    >
        <slot />
    </button>
</template>
