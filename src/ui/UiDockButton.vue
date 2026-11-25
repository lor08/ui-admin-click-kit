<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'ghost' | 'green' | 'red' | 'light';

/**
 * A button of the softphone, Click's `.btn` of the dock: `ghost` on the dark
 * bar, `light` on a white panel, `green` to call or answer, `red` to hang
 * up or reject. `round` is the pill of the call's main action, `wide` the
 * full-width Dial of the panel. A button with an icon alone is named by
 * `label`, which is its tooltip too. With `href` it is a link that looks
 * the same (Click's `tel:` choice).
 */
const props = withDefaults(
    defineProps<{
        variant?: Variant;
        label?: string;
        round?: boolean;
        active?: boolean;
        pulse?: boolean;
        wide?: boolean;
        small?: boolean;
        disabled?: boolean;
        href?: string;
    }>(),
    { variant: 'ghost', href: undefined, label: undefined, round: false, active: false, pulse: false, wide: false, small: false, disabled: false },
);

const variants: Record<Variant, string> = {
    ghost: 'border-white/16 bg-white/8 text-dock-ink',
    green: 'bg-dock-call text-white',
    red: 'bg-dock-hangup text-white',
    light: 'border-slate-200 bg-slate-100 text-slate-700',
};

const classes = computed(() => [
    'inline-flex cursor-pointer items-center gap-1.5 border whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dock-active',
    props.active ? 'border-transparent bg-dock-active text-white' : props.variant === 'ghost' || props.variant === 'light' ? variants[props.variant] : `border-transparent ${variants[props.variant]}`,
    props.round ? 'rounded-2xl px-4 py-[5px]' : 'rounded-[6px]',
    props.wide ? 'w-full justify-center py-[9px] text-sm' : props.small ? 'px-[9px] py-[3px] text-[12.5px]' : 'px-3 py-[5px] text-[12.5px]',
    props.pulse ? 'animate-dock-pulse' : '',
]);
</script>

<template>
    <a v-if="props.href !== undefined" :href="props.href" :class="classes" :aria-label="props.label" :title="props.label">
        <slot />
    </a>
    <button v-else type="button" :class="classes" :disabled="props.disabled" :aria-label="props.label" :title="props.label" :aria-pressed="props.active ? 'true' : undefined">
        <slot />
    </button>
</template>
