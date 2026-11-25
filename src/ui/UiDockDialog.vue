<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

/**
 * Click's CallMethodDialog card: a question over the page and the
 * softphone's bar, its hint, and the answers in a column. Escape anywhere
 * and a click on the shade cancel; the focus starts on the control marked
 * `data-autofocus`, so Enter does what it does.
 */
const props = defineProps<{ title: string; hint: string; label: string }>();
const emit = defineEmits<{ cancel: [] }>();

const card = ref<HTMLElement | null>(null);

function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        event.stopPropagation();
        emit('cancel');
    }
}

onMounted(() => {
    document.addEventListener('keydown', onKeydown);
    card.value?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
});

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
    <div class="fixed inset-0 z-[9100] flex items-center justify-center bg-[rgb(15_23_42/0.55)] p-4" @click.self="emit('cancel')">
        <div ref="card" class="w-full max-w-[380px] rounded-[10px] border border-slate-300 bg-white px-[18px] py-4 text-[13px] text-slate-800 shadow-[0_10px_30px_rgb(15_23_42/0.25)]" role="dialog" aria-modal="true" :aria-label="props.label">
            <div class="mb-1 text-[15px] font-semibold break-words">{{ props.title }}</div>
            <div class="mb-3.5 text-xs text-slate-500">{{ props.hint }}</div>
            <div class="flex flex-col gap-2">
                <slot />
            </div>
        </div>
    </div>
</template>
