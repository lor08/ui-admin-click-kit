<script setup lang="ts">
import UiIcon from './UiIcon.vue';

/**
 * A colleague in the softphone's panel, Click's `.vd-row` of the
 * Colleagues tab: the point that says whether their softphone is there,
 * the name, the extension and status, and the small green button that
 * calls them, greyed out when they cannot take the call.
 */
const props = withDefaults(defineProps<{ online: boolean; label: string; meta: string; actionLabel: string; disabled?: boolean }>(), { disabled: false });
const emit = defineEmits<{ action: [] }>();
</script>

<template>
    <div class="flex items-center gap-2 border-b border-slate-100 px-0.5 py-1.5 text-[12.5px]">
        <span class="inline-block h-2 w-2 shrink-0 rounded-full" :class="props.online ? 'bg-dock-ok' : 'bg-dock-off'" aria-hidden="true" data-test="presence" />
        <span class="min-w-0 flex-1 truncate">{{ props.label }}</span>
        <span class="text-[11.5px] whitespace-nowrap text-slate-500">{{ props.meta }}</span>
        <button
            type="button"
            class="inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-dock-call text-white disabled:cursor-not-allowed disabled:opacity-40"
            :class="{ 'cursor-pointer': !props.disabled }"
            :disabled="props.disabled"
            :aria-label="props.actionLabel"
            :title="props.actionLabel"
            data-test="call-colleague"
            @click="emit('action')"
        >
            <UiIcon name="phone" />
        </button>
    </div>
</template>
