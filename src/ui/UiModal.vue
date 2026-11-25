<script setup lang="ts">
import UiIconButton from './UiIconButton.vue';
import { useTrans } from './kit';
import { X } from 'lucide-vue-next';
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui';

type Size = 'sm' | 'md' | 'lg' | 'xl';

/**
 * A dialog over the page: focus is trapped inside, Escape and the backdrop
 * ask to close, focus returns to where it was. The parent owns `open`.
 */
const props = withDefaults(defineProps<{ open: boolean; title: string; description?: string | null; size?: Size }>(), {
    description: null,
    size: 'md',
});

const emit = defineEmits<{ close: [] }>();

const t = useTrans();

const sizes: Record<Size, string> = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

function onOpenChange(open: boolean): void {
    if (!open) {
        emit('close');
    }
}

/** The first control of the dialog gets the focus; without one, reka's default (the first focusable, the close button) stands. */
function focusFirstControl(event: Event): void {
    const content = event.target;
    if (!(content instanceof HTMLElement)) {
        return;
    }
    const control = content.querySelector<HTMLElement>('input:not([type=hidden]), textarea, select');
    if (control) {
        event.preventDefault();
        control.focus();
    }
}
</script>

<template>
    <DialogRoot :open="props.open" @update:open="onOpenChange">
        <DialogPortal>
            <DialogOverlay class="fixed inset-0 z-40 bg-ink/40" data-test="backdrop" />
            <DialogContent
                class="fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-card border border-line bg-surface shadow-xl focus:outline-none"
                :class="sizes[props.size]"
                aria-modal="true"
                v-bind="props.description ? {} : { 'aria-describedby': undefined }"
                @open-auto-focus="focusFirstControl"
            >
                <header class="flex items-start justify-between gap-4 px-6 pt-6">
                    <div class="min-w-0">
                        <DialogTitle class="text-base font-semibold text-ink">{{ props.title }}</DialogTitle>
                        <DialogDescription v-if="props.description" class="mt-1 text-sm text-ink-muted">{{ props.description }}</DialogDescription>
                    </div>
                    <DialogClose as-child>
                        <UiIconButton :label="t('ui.close')" size="sm" class="-mr-2 -mt-1"><X /></UiIconButton>
                    </DialogClose>
                </header>
                <div class="overflow-y-auto px-6 py-4">
                    <slot />
                </div>
                <footer v-if="$slots.footer" class="flex flex-wrap justify-end gap-2 border-t border-line px-6 py-4">
                    <slot name="footer" />
                </footer>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>
