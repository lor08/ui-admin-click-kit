<script setup lang="ts">
import UiIconButton from './UiIconButton.vue';
import { useTrans } from './kit';
import { X } from '@lucide/vue';
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui';

type Size = 'md' | 'lg';

/**
 * A panel that slides in from the right over the page: the detail of a row
 * the reader opens without leaving the list. Focus is trapped inside,
 * Escape and the backdrop close it, focus returns to where it was. The
 * parent owns `open` through v-model:open.
 */
const props = withDefaults(defineProps<{ open: boolean; title: string; description?: string | null; size?: Size }>(), {
    description: null,
    size: 'md',
});

const emit = defineEmits<{ 'update:open': [open: boolean] }>();

const t = useTrans();

const sizes: Record<Size, string> = { md: 'sm:max-w-md', lg: 'sm:max-w-[40rem]' };
</script>

<template>
    <DialogRoot :open="props.open" @update:open="(open: boolean) => emit('update:open', open)">
        <DialogPortal>
            <DialogOverlay class="fixed inset-0 z-40 bg-ink/40" data-test="backdrop" />
            <DialogContent
                class="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-line bg-surface shadow-xl focus:outline-none data-[state=closed]:animate-drawer-out data-[state=open]:animate-drawer-in motion-reduce:animate-none"
                :class="sizes[props.size]"
                :data-size="props.size"
                aria-modal="true"
            >
                <header class="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
                    <div class="min-w-0">
                        <DialogTitle class="text-base font-semibold text-ink">{{ props.title }}</DialogTitle>
                        <DialogDescription v-if="props.description" class="mt-1 text-sm text-ink-muted">{{ props.description }}</DialogDescription>
                    </div>
                    <div class="-mr-2 -mt-1 flex shrink-0 items-center gap-1" data-test="drawer-actions">
                        <slot name="actions" />
                        <DialogClose as-child>
                            <UiIconButton :label="t('ui.close')" size="sm"><X /></UiIconButton>
                        </DialogClose>
                    </div>
                </header>
                <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                    <slot />
                </div>
                <footer v-if="$slots.footer" class="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">
                    <slot name="footer" />
                </footer>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>
