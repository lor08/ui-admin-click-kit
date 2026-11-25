<script setup lang="ts">
import UiAlert from '../../ui/UiAlert.vue';
import UiButton from '../../ui/UiButton.vue';
import { useTrans } from '../words';
import { ref } from 'vue';

const t = useTrans();
const dismissed = ref(false);
</script>

<template>
    <div class="space-y-3">
        <UiAlert variant="info">{{ t('ui_kit.samples.alert_info') }}</UiAlert>
        <UiAlert variant="success">{{ t('ui_kit.samples.alert_success') }}</UiAlert>
        <UiAlert variant="warning" :title="t('ui_kit.samples.alert_title')">{{ t('ui_kit.samples.alert_warning') }}</UiAlert>
        <UiAlert v-if="!dismissed" variant="danger" dismissible @dismiss="dismissed = true">{{ t('ui_kit.samples.alert_danger') }}</UiAlert>
        <UiButton v-else variant="link" size="sm" @click="dismissed = false">{{ t('ui_kit.samples.open') }}</UiButton>
    </div>
</template>
