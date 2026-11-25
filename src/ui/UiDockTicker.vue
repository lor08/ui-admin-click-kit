<script setup lang="ts">
/**
 * Click's live transcript line above the softphone's bar: who said the
 * last line, the line cut to one row, and the `live` mark once the
 * transcript of the call is coming.
 */
const props = defineProps<{ who: string; text: string; live: string | null }>();
</script>

<template>
    <div class="flex w-full items-center gap-1.5 border-b border-white/[0.06] bg-[#16202e] px-3.5 py-1 text-xs text-[#9db2cc]">
        <span class="shrink-0 font-semibold text-[#6ee7b7]">{{ props.who }}:</span>
        <span class="min-w-0 flex-1 truncate">{{ props.text }}</span>
        <span v-if="props.live !== null" class="shrink-0 text-[10.5px] tracking-[0.5px] text-[#f87171]">{{ props.live }}</span>
    </div>
</template>
