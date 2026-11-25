<script setup lang="ts">
import UiButton from '../../ui/UiButton.vue';
import UiConfirmDialog from '../../ui/UiConfirmDialog.vue';
import { useToast } from '../../ui/toast';
import { useTrans } from '../words';
import { ref } from 'vue';

const t = useTrans();
const toast = useToast();
const open = ref(false);
const processing = ref(false);

function confirmed(): void {
    processing.value = true;
    setTimeout(() => {
        processing.value = false;
        open.value = false;
        toast.success(t('ui_kit.samples.confirmed'));
    }, 800);
}
</script>

<template>
    <UiButton variant="danger" @click="open = true">{{ t('ui_kit.samples.confirm_label') }}</UiButton>
    <UiConfirmDialog :open="open" :title="t('ui_kit.samples.confirm_title')" :message="t('ui_kit.samples.confirm_message')" :confirm-label="t('ui_kit.samples.confirm_label')" tone="danger" :processing="processing" @confirm="confirmed" @cancel="open = false" />
</template>
