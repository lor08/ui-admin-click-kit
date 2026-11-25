<script setup lang="ts">
import UiSpinner from './UiSpinner.vue';
import { kitLink } from './kit';
import { computed } from 'vue';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

const props = withDefaults(
    defineProps<{
        variant?: ButtonVariant;
        /** A link that looks like a button, for navigation without a form. */
        href?: string;
        /** With `href`: a file to save, not a page; a plain link the browser downloads, outside the app's router. */
        download?: boolean;
        /** With `href`: the page opens in a new tab, a plain link outside the app's router. */
        newTab?: boolean;
        type?: 'button' | 'submit';
        size?: ButtonSize;
        block?: boolean;
        disabled?: boolean;
        /** The request is running: the button is disabled and shows a spinner. */
        loading?: boolean;
        /** The words break into lines and start at the left: a link that is a whole sentence. */
        wrap?: boolean;
    }>(),
    { variant: 'primary', href: undefined, download: false, newTab: false, type: 'button', size: 'md', block: false, disabled: false, loading: false, wrap: false },
);

const variants: Record<ButtonVariant, string> = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600',
    secondary: 'border border-line bg-surface text-ink hover:bg-canvas focus-visible:outline-brand-600',
    danger: 'bg-danger text-white hover:opacity-90 focus-visible:outline-danger',
    ghost: 'text-brand-600 hover:bg-brand-50 focus-visible:outline-brand-600',
    link: 'h-auto px-0 py-0 text-brand-600 underline-offset-4 hover:underline focus-visible:outline-brand-600',
};

const sizes: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-10 px-5 text-sm',
};

const classes = computed(() => [
    'inline-flex shrink-0 items-center gap-2 rounded-control font-medium transition-colors',
    props.wrap ? 'justify-start text-left' : 'justify-center whitespace-nowrap',
    'focus-visible:outline-2 focus-visible:outline-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
    sizes[props.size],
    variants[props.variant],
    props.block ? 'w-full' : '',
]);

const inactive = computed(() => props.disabled || props.loading);

const link = kitLink();
</script>

<template>
    <a v-if="props.href && props.download" :class="classes" :href="props.href" download :aria-disabled="inactive ? 'true' : undefined" :tabindex="inactive ? -1 : undefined">
        <slot name="icon" />
        <slot />
        <slot name="trailing" />
    </a>

    <a v-else-if="props.href && props.newTab" :class="classes" :href="props.href" target="_blank" rel="noopener" :aria-disabled="inactive ? 'true' : undefined" :tabindex="inactive ? -1 : undefined">
        <slot name="icon" />
        <slot />
        <slot name="trailing" />
    </a>

    <component :is="link" v-else-if="props.href" :class="classes" :href="props.href" :aria-disabled="inactive ? 'true' : undefined" :tabindex="inactive ? -1 : undefined">
        <slot name="icon" />
        <slot />
        <slot name="trailing" />
    </component>

    <button v-else :class="classes" :type="props.type" :disabled="inactive" :aria-busy="props.loading ? 'true' : undefined">
        <UiSpinner v-if="props.loading" size="sm" />
        <slot v-else name="icon" />
        <slot />
        <slot name="trailing" />
    </button>
</template>
