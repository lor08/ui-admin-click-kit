<script setup lang="ts">
import UiDockPlainButton from './UiDockPlainButton.vue';
import UiIcon from './UiIcon.vue';

/**
 * A white card over the dock's right end, Click's `.voice-dock-panel`: a
 * title, its buttons and a cross, then the content; `narrow` is the DTMF
 * keypad's width.
 */
const props = withDefaults(defineProps<{ title: string; closeLabel: string; narrow?: boolean }>(), { narrow: false });
const emit = defineEmits<{ close: [] }>();
</script>

<template>
    <section
        class="max-h-[calc(100vh-56px)] overflow-y-auto rounded-t-[10px] border border-slate-300 bg-white px-3.5 py-3 text-slate-800 shadow-[0_-6px_24px_rgb(15_23_42/0.18)]"
        :class="props.narrow ? 'w-[240px]' : 'w-[340px] max-w-[calc(100vw-32px)]'"
        :aria-label="props.title"
    >
        <div class="mb-2 flex items-center justify-between font-semibold">
            <span class="truncate">{{ props.title }}</span>
            <span class="flex items-center gap-1">
                <slot name="actions" />
                <UiDockPlainButton :label="props.closeLabel" @click="emit('close')"><UiIcon name="close" /></UiDockPlainButton>
            </span>
        </div>
        <slot />
    </section>
</template>
