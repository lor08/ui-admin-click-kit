<script setup lang="ts">
import { computed } from 'vue';

/**
 * A level in the softphone's settings, as the microphone hears it: the
 * label above a thin bar filled to `value` (0 to 1, clamped), read out
 * as a meter in whole percent.
 */
const props = defineProps<{ label: string; value: number }>();

const percent = computed(() => Math.round(Math.min(1, Math.max(0, Number.isFinite(props.value) ? props.value : 0)) * 100));
</script>

<template>
    <div class="block">
        <span aria-hidden="true">{{ props.label }}</span>
        <div role="meter" :aria-label="props.label" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="percent" class="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div class="h-full rounded-full bg-dock-call transition-[width] duration-100" :style="{ width: `${percent}%` }" />
        </div>
    </div>
</template>
