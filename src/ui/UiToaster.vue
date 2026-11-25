<script setup lang="ts">
import UiIconButton from './UiIconButton.vue';
import { useToast, type Toast } from './toast';
import { useTrans } from './kit';
import { CircleCheck, CircleX, Info, TriangleAlert, X } from 'lucide-vue-next';
import { onBeforeUnmount, watch } from 'vue';
import type { Tone } from './styles';

/** The corner where toasts appear; one per layout. Pushing is useToast()'s job. */
const { toasts, dismiss } = useToast();
const t = useTrans();

const timers = new Map<number, ReturnType<typeof setTimeout>>();

watch(
    () => toasts.map((toast) => toast.id),
    () => {
        for (const toast of toasts) {
            if (toast.timeout > 0 && !timers.has(toast.id)) {
                timers.set(
                    toast.id,
                    setTimeout(() => {
                        timers.delete(toast.id);
                        dismiss(toast.id);
                    }, toast.timeout),
                );
            }
        }
        for (const [id, timer] of timers) {
            if (!toasts.some((toast) => toast.id === id)) {
                clearTimeout(timer);
                timers.delete(id);
            }
        }
    },
    { immediate: true },
);

onBeforeUnmount(() => timers.forEach((timer) => clearTimeout(timer)));

const tones: Record<Tone, string> = {
    neutral: 'border-line bg-surface text-ink',
    brand: 'border-brand-200 bg-brand-50 text-brand-700',
    success: 'border-success/30 bg-success-surface text-success',
    warning: 'border-warning/30 bg-warning-surface text-warning',
    danger: 'border-danger/30 bg-danger-surface text-danger',
    info: 'border-info/30 bg-info-surface text-info',
};

const icons: Record<Tone, typeof Info | null> = { neutral: null, brand: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleX, info: Info };

function roleOf(toast: Toast): 'alert' | 'status' {
    return toast.tone === 'danger' ? 'alert' : 'status';
}
</script>

<template>
    <div class="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-end gap-2 px-4 sm:inset-x-auto sm:right-4" aria-live="polite">
        <TransitionGroup enter-from-class="translate-y-[-8px] opacity-0" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-150">
            <div
                v-for="toast in toasts"
                :key="toast.id"
                class="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border px-4 py-3 text-sm shadow-lg"
                :class="tones[toast.tone]"
                :role="roleOf(toast)"
                data-test="toast"
            >
                <component :is="icons[toast.tone]" v-if="icons[toast.tone]" class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <div class="min-w-0 grow">
                    <p class="font-medium">{{ toast.title }}</p>
                    <p v-if="toast.message" class="mt-0.5 text-ink">{{ toast.message }}</p>
                </div>
                <UiIconButton :label="t('ui.close')" size="sm" class="-my-1 -mr-2 text-current hover:bg-black/5 hover:text-current" @click="dismiss(toast.id)"><X /></UiIconButton>
            </div>
        </TransitionGroup>
    </div>
</template>
