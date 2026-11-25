<script setup lang="ts">
import UiIcon from './UiIcon.vue';
import type { IconName } from './icons';

/**
 * A line of the softphone's history, Click's `.vd-row`: the direction's
 * icon in its colour, who, when, and the round green button that calls
 * back.
 */
type Tone = 'out' | 'in' | 'internal' | 'missed';

const props = defineProps<{ icon: IconName; tone: Tone; label: string; meta: string; actionLabel: string }>();
const emit = defineEmits<{ action: [] }>();

const tones: Record<Tone, string> = { out: 'text-green-600', in: 'text-blue-600', internal: 'text-violet-600', missed: 'text-red-600' };
</script>

<template>
    <div class="flex items-center gap-2 border-b border-slate-100 px-0.5 py-1.5 text-[12.5px]">
        <span class="w-4 text-center" :class="tones[props.tone]"><UiIcon :name="props.icon" /></span>
        <span class="min-w-0 flex-1 truncate">{{ props.label }}</span>
        <span class="text-[11.5px] whitespace-nowrap text-slate-500">{{ props.meta }}</span>
        <button type="button" class="inline-flex h-[26px] w-[26px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-dock-call text-white" :aria-label="props.actionLabel" :title="props.actionLabel" @click="emit('action')">
            <UiIcon name="phone" />
        </button>
    </div>
</template>
