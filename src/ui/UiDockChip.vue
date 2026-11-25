<script setup lang="ts">
import { DOCK_DOTS, type DockDot } from './dock';

/**
 * The pill of the dock, Click's `.chip`: the agent's status with its
 * coloured point (`ok` takes calls, `dnd` does not, `wait` is on its way,
 * `err` failed, `off` is offline), the missed call to ring back, or, in
 * the `line` tone, Click's `.chip.line2`: the second line. A chip that
 * holds buttons of its own (the second line's Answer and Decline) is
 * `inert`: a span, since a button cannot hold another. The `sudo` tone is
 * Click's `.chip.sudo`: the admin works as another agent.
 */
type Tone = 'default' | 'miss' | 'line' | 'sudo';

const props = withDefaults(defineProps<{ dot?: DockDot; tone?: Tone; label?: string; inert?: boolean }>(), { dot: undefined, tone: 'default', label: undefined, inert: false });

const tones: Record<Tone, string> = {
    default: 'border-white/14 text-dock-ink',
    miss: 'border-white/14 text-dock-miss',
    line: 'border-dock-ok/40 text-dock-timer',
    sudo: 'border-dock-err text-dock-miss bg-dock-err/12!',
};
</script>

<template>
    <component
        :is="props.inert ? 'span' : 'button'"
        :type="props.inert ? undefined : 'button'"
        class="inline-flex items-center gap-1.5 rounded-[14px] border bg-white/8 px-2.5 py-[3px] whitespace-nowrap"
        :class="[tones[props.tone], props.inert ? '' : 'cursor-pointer']"
        :title="props.label"
    >
        <span v-if="props.dot" class="inline-block h-[9px] w-[9px] rounded-full" :class="DOCK_DOTS[props.dot]" aria-hidden="true" />
        <slot />
    </component>
</template>
