<script setup lang="ts">
/**
 * The number field of the softphone, Click's `.quick-input` on the dark bar
 * or, `wide`, its `.dial-input` across a white panel. Enter dials.
 */
const props = withDefaults(defineProps<{ placeholder: string; label: string; wide?: boolean; disabled?: boolean }>(), { wide: false, disabled: false });
const model = defineModel<string>({ required: true });
const emit = defineEmits<{ enter: []; focus: [] }>();
</script>

<template>
    <input
        v-model="model"
        type="tel"
        autocomplete="off"
        class="rounded-[6px] border px-2.5 py-[5px] outline-none disabled:opacity-60"
        :class="props.wide ? 'mb-2 w-full border-slate-300 bg-white text-slate-800 placeholder:text-slate-400' : 'w-[150px] border-white/14 bg-white/8 text-dock-ink placeholder:text-dock-muted xl:w-[220px]'"
        :disabled="props.disabled"
        :placeholder="props.placeholder"
        :aria-label="props.label"
        @keydown.enter="emit('enter')"
        @focus="emit('focus')"
    />
</template>
