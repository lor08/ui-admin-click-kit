<script setup lang="ts">
/** A few lines of text in a panel of the softphone, Click's `.note-area`: the call's note. */
const props = withDefaults(defineProps<{ placeholder: string; label: string; rows?: number; maxlength?: number }>(), { rows: 3, maxlength: undefined });
const model = defineModel<string>({ required: true });
</script>

<template>
    <textarea
        v-model="model"
        class="mb-2 w-full resize-y rounded-[6px] border border-slate-300 p-2 text-slate-800 outline-none placeholder:text-slate-400"
        :rows="props.rows"
        :maxlength="props.maxlength"
        :placeholder="props.placeholder"
        :aria-label="props.label"
    />
</template>
