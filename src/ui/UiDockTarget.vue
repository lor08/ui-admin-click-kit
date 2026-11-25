<script setup lang="ts">
/**
 * A colleague the call can go to, Click's `.vd-row` of the Transfer
 * panel: the green point of a softphone that is there, the name, and the
 * buttons that send the call or add them to it.
 */
const props = defineProps<{ label: string }>();
</script>

<template>
    <div class="flex items-center gap-2 border-b border-slate-100 px-0.5 py-1.5 text-[12.5px]">
        <span class="inline-block h-2 w-2 shrink-0 rounded-full bg-dock-ok" aria-hidden="true" />
        <span class="min-w-0 flex-1 truncate">{{ props.label }}</span>
        <slot />
    </div>
</template>
