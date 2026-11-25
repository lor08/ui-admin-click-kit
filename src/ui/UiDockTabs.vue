<script setup lang="ts">
/**
 * The tabs of the softphone's panel, Click's `.panel-tabs`: one segmented
 * row. A tab's `badge` above zero shows beside its label in Click's amber
 * `.tab-badge` (the calls waiting in the agent's queues).
 */
const props = defineProps<{ tabs: { value: string; label: string; badge?: number }[] }>();
const model = defineModel<string>({ required: true });
</script>

<template>
    <div class="mb-2.5 flex overflow-hidden rounded-[6px] border border-slate-200 bg-slate-100" role="tablist">
        <button
            v-for="tab in props.tabs"
            :key="tab.value"
            type="button"
            role="tab"
            class="flex-1 cursor-pointer py-[7px] text-center text-[12.5px]"
            :class="model === tab.value ? 'bg-white font-semibold text-dock-tab shadow-[inset_0_-2px_0_var(--color-dock-active)]' : 'text-slate-500'"
            :aria-selected="model === tab.value ? 'true' : 'false'"
            :data-test="`tab-${tab.value}`"
            @click="model = tab.value"
        >
            {{ tab.label }}<span v-if="tab.badge" class="ml-1 rounded-lg bg-amber-500 px-[5px] text-[10.5px] font-bold text-white" :data-test="`tab-badge-${tab.value}`">{{ tab.badge }}</span>
        </button>
    </div>
</template>
