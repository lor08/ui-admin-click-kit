<script setup lang="ts">
/**
 * A line of the softphone's panel, Click's `.vd-row` of the Queues tab: the
 * point (`dot`: the agent is in the queue or not; none on a line without
 * one), the label, the small grey meta, and in the slot the line's action.
 */
const props = withDefaults(defineProps<{ label: string; dot?: 'ok' | 'off'; meta?: string }>(), { dot: undefined, meta: undefined });
</script>

<template>
    <div class="flex items-center gap-2 border-b border-slate-100 px-0.5 py-1.5 text-[12.5px]">
        <span v-if="props.dot" class="inline-block h-2 w-2 shrink-0 rounded-full" :class="props.dot === 'ok' ? 'bg-dock-ok' : 'bg-dock-off'" aria-hidden="true" data-test="line-dot" />
        <span class="min-w-0 flex-1 truncate" data-test="line-label">{{ props.label }}</span>
        <span v-if="props.meta" class="text-[11.5px] whitespace-nowrap text-slate-500" data-test="line-meta">{{ props.meta }}</span>
        <slot />
    </div>
</template>
