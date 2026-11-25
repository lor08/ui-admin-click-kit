<script setup lang="ts">
import UiButton from '../../ui/UiButton.vue';
import { useToast } from '../../ui/toast';
import { useTrans } from '../words';

const t = useTrans();
const toast = useToast();
</script>

<template>
    <div class="flex flex-wrap gap-2">
        <UiButton variant="secondary" size="sm" @click="toast.success(t('ui_kit.samples.toast_success'), t('ui_kit.samples.toast_message'))">success</UiButton>
        <UiButton variant="secondary" size="sm" @click="toast.error(t('ui_kit.samples.toast_error'))">danger</UiButton>
        <UiButton variant="secondary" size="sm" @click="toast.info(t('ui_kit.samples.toast_info'))">info</UiButton>
        <UiButton variant="secondary" size="sm" @click="toast.push({ tone: 'warning', title: t('ui_kit.samples.alert_warning') })">warning</UiButton>
        <UiButton variant="secondary" size="sm" @click="toast.push({ tone: 'neutral', title: t('ui_kit.samples.toast_neutral'), timeout: 0 })">neutral · timeout 0</UiButton>
    </div>
</template>
