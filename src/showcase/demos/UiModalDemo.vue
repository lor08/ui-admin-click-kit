<script setup lang="ts">
import UiButton from '../../ui/UiButton.vue';
import UiInput from '../../ui/UiInput.vue';
import UiModal from '../../ui/UiModal.vue';
import { useTrans } from '../words';
import { ref } from 'vue';

const t = useTrans();
const size = ref<'sm' | 'md' | 'lg' | null>(null);
const value = ref('');
</script>

<template>
    <div class="flex flex-wrap gap-2">
        <UiButton variant="secondary" @click="size = 'sm'">{{ t('ui_kit.samples.modal_sm') }}</UiButton>
        <UiButton variant="secondary" @click="size = 'md'">{{ t('ui_kit.samples.modal_md') }}</UiButton>
        <UiButton variant="secondary" @click="size = 'lg'">{{ t('ui_kit.samples.modal_lg') }}</UiButton>
    </div>
    <UiModal :open="size !== null" :title="t('ui_kit.samples.modal_title')" :description="t('ui_kit.samples.modal_description')" :size="size ?? 'md'" @close="size = null">
        <UiInput v-model="value" :label="t('ui_kit.samples.phone')" :placeholder="t('ui_kit.samples.phone_placeholder')" />
        <template #footer>
            <UiButton variant="secondary" @click="size = null">{{ t('ui_kit.samples.cancel') }}</UiButton>
            <UiButton @click="size = null">{{ t('ui_kit.samples.save') }}</UiButton>
        </template>
    </UiModal>
</template>
