<script setup lang="ts">
import UiButton from './UiButton.vue';
import UiModal from './UiModal.vue';
import { useTrans } from './kit';

/** "Are you sure?" with one action: the parent runs it on `confirm` and closes the dialog when done. */
const props = withDefaults(
    defineProps<{
        open: boolean;
        title: string;
        message?: string | null;
        confirmLabel?: string;
        cancelLabel?: string;
        tone?: 'brand' | 'danger';
        processing?: boolean;
    }>(),
    { message: null, confirmLabel: undefined, cancelLabel: undefined, tone: 'brand', processing: false },
);

const emit = defineEmits<{ confirm: []; cancel: [] }>();

const t = useTrans();
</script>

<template>
    <UiModal :open="props.open" :title="props.title" size="sm" @close="emit('cancel')">
        <p v-if="props.message" class="text-sm text-ink">{{ props.message }}</p>
        <slot />
        <template #footer>
            <UiButton variant="secondary" :disabled="props.processing" data-test="cancel" @click="emit('cancel')">{{ props.cancelLabel ?? t('ui.cancel') }}</UiButton>
            <UiButton :variant="props.tone === 'danger' ? 'danger' : 'primary'" :loading="props.processing" data-test="confirm" @click="emit('confirm')">
                {{ props.confirmLabel ?? t('ui.confirm') }}
            </UiButton>
        </template>
    </UiModal>
</template>
